"use client";
import { useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useAppStore } from "@/store/appStore";
import {
  syncProfileToFirestore,
  syncTargetsToFirestore,
  syncWeightsToFirestore,
  syncFoodsToFirestore,
  syncDiaryToFirestore,
  syncWorkoutsToFirestore,
  subscribeToUserData,
  loadProfileFromFirestore,
  loadTargetsFromFirestore,
  loadWeightsFromFirestore,
  loadFoodsFromFirestore,
  loadDiaryFromFirestore,
  loadWorkoutsFromFirestore,
} from "@/lib/firestore";

export function useFirestoreSync() {
  const { user } = useAuth();
  const profile = useAppStore((s) => s.profile);
  const targets = useAppStore((s) => s.targets);
  const weights = useAppStore((s) => s.weights);
  const foods = useAppStore((s) => s.foods);
  const diary = useAppStore((s) => s.diary);
  const workouts = useAppStore((s) => s.workouts);
  const setProfile = useAppStore((s) => s.setProfile);
  const setTargets = useAppStore((s) => s.setTargets);
  const syncInProgress = useRef(false);
  const initialLoadDone = useRef(false);
  const lastSyncedState = useRef<{
    weights: string;
    foods: string;
    diary: string;
    workouts: string;
  }>({
    weights: "",
    foods: "",
    diary: "",
    workouts: "",
  });

  // Initial load from Firestore when user logs in
  useEffect(() => {
    if (!user || initialLoadDone.current) return;

    const loadData = async () => {
      try {
        const [profileData, targetsData, weightsData, foodsData, diaryData, workoutsData] =
          await Promise.all([
            loadProfileFromFirestore(user.uid),
            loadTargetsFromFirestore(user.uid),
            loadWeightsFromFirestore(user.uid),
            loadFoodsFromFirestore(user.uid),
            loadDiaryFromFirestore(user.uid),
            loadWorkoutsFromFirestore(user.uid),
          ]);

        // Only update if Firestore has data, otherwise keep local state
        if (profileData) setProfile(profileData);
        if (targetsData) setTargets(targetsData);
        
        // Only overwrite arrays if Firestore has data, otherwise merge with local defaults
        const currentState = useAppStore.getState();
        useAppStore.setState({
          weights: weightsData.length > 0 ? weightsData : currentState.weights,
          foods: foodsData.length > 0 ? foodsData : currentState.foods,
          diary: diaryData.length > 0 ? diaryData : currentState.diary,
          workouts: workoutsData.length > 0 ? workoutsData : currentState.workouts,
        });
        
        // Update last synced state
        lastSyncedState.current = {
          weights: JSON.stringify(weightsData.length > 0 ? weightsData : currentState.weights),
          foods: JSON.stringify(foodsData.length > 0 ? foodsData : currentState.foods),
          diary: JSON.stringify(diaryData.length > 0 ? diaryData : currentState.diary),
          workouts: JSON.stringify(workoutsData.length > 0 ? workoutsData : currentState.workouts),
        };
        
        initialLoadDone.current = true;
      } catch (error) {
        console.error("Error loading data from Firestore:", error);
        initialLoadDone.current = true; // Mark as done even on error to allow retries
      }
    };

    loadData();
  }, [user, setProfile, setTargets]);

  // Sync to Firestore when data changes (debounced)
  useEffect(() => {
    if (!user || !initialLoadDone.current || syncInProgress.current) return;

    const timeoutId = setTimeout(async () => {
      syncInProgress.current = true;
      try {
        await Promise.all([
          syncProfileToFirestore(user.uid, profile),
          syncTargetsToFirestore(user.uid, targets),
          syncWeightsToFirestore(user.uid, weights),
          syncFoodsToFirestore(user.uid, foods),
          syncDiaryToFirestore(user.uid, diary),
          syncWorkoutsToFirestore(user.uid, workouts),
        ]);
        
        // Update last synced state after successful sync
        lastSyncedState.current = {
          weights: JSON.stringify(weights),
          foods: JSON.stringify(foods),
          diary: JSON.stringify(diary),
          workouts: JSON.stringify(workouts),
        };
      } catch (error) {
        console.error("Error syncing to Firestore:", error);
      } finally {
        syncInProgress.current = false;
      }
    }, 1000); // Debounce 1 second

    return () => clearTimeout(timeoutId);
  }, [user, profile, targets, weights, foods, diary, workouts]);

  // Subscribe to real-time updates (only setup once)
  useEffect(() => {
    if (!user || !initialLoadDone.current) return;

    const unsubscribe = subscribeToUserData(user.uid, {
      onProfile: (profileData) => {
        // Only update if not currently syncing and data is different
        if (!syncInProgress.current && profileData) {
          const currentProfile = useAppStore.getState().profile;
          if (JSON.stringify(profileData) !== JSON.stringify(currentProfile)) {
            setProfile(profileData);
          }
        }
      },
      onTargets: (targetsData) => {
        if (!syncInProgress.current && targetsData) {
          const currentTargets = useAppStore.getState().targets;
          if (JSON.stringify(targetsData) !== JSON.stringify(currentTargets)) {
            setTargets(targetsData);
          }
        }
      },
      onWeights: (weightsData) => {
        // Only update if not syncing
        if (!syncInProgress.current) {
          const currentState = useAppStore.getState();
          const remoteStr = JSON.stringify(weightsData);
          const currentStr = JSON.stringify(currentState.weights);
          const lastSyncedStr = lastSyncedState.current.weights;
          
          // Only update if remote is different from current AND different from what we last synced
          // This prevents overwriting local changes that haven't synced yet
          if (remoteStr !== currentStr && remoteStr !== lastSyncedStr) {
            // If current state equals last synced, we have no pending local changes - safe to update
            // Or if remote has more items than what we last synced, it's likely a legitimate update
            if (currentStr === lastSyncedStr || weightsData.length > JSON.parse(lastSyncedStr || "[]").length) {
              useAppStore.setState({ weights: weightsData });
              lastSyncedState.current.weights = remoteStr;
            }
          }
        }
      },
      onFoods: (foodsData) => {
        if (!syncInProgress.current) {
          const currentState = useAppStore.getState();
          const remoteStr = JSON.stringify(foodsData);
          const currentStr = JSON.stringify(currentState.foods);
          const lastSyncedStr = lastSyncedState.current.foods;
          
          if (remoteStr !== currentStr && remoteStr !== lastSyncedStr) {
            const lastSynced = JSON.parse(lastSyncedStr || "[]");
            // Prevent overwriting local data with empty arrays
            if (foodsData.length === 0 && currentState.foods.length > 0) {
              return; // Don't overwrite local data with empty remote
            }
            // Only update if no local changes pending or remote has legitimate updates
            if (currentStr === lastSyncedStr || foodsData.length > lastSynced.length) {
              useAppStore.setState({ foods: foodsData });
              lastSyncedState.current.foods = remoteStr;
            }
          }
        }
      },
      onDiary: (diaryData) => {
        if (!syncInProgress.current) {
          const currentState = useAppStore.getState();
          const remoteStr = JSON.stringify(diaryData);
          const currentStr = JSON.stringify(currentState.diary);
          const lastSyncedStr = lastSyncedState.current.diary;
          
          if (remoteStr !== currentStr && remoteStr !== lastSyncedStr) {
            const lastSynced = JSON.parse(lastSyncedStr || "[]");
            // Prevent overwriting local data with empty arrays
            if (diaryData.length === 0 && currentState.diary.length > 0) {
              return; // Don't overwrite local data with empty remote
            }
            // Only update if no local changes pending or remote has legitimate updates
            if (currentStr === lastSyncedStr || diaryData.length > lastSynced.length) {
              useAppStore.setState({ diary: diaryData });
              lastSyncedState.current.diary = remoteStr;
            }
          }
        }
      },
      onWorkouts: (workoutsData) => {
        if (!syncInProgress.current) {
          const currentState = useAppStore.getState();
          const remoteStr = JSON.stringify(workoutsData);
          const currentStr = JSON.stringify(currentState.workouts);
          const lastSyncedStr = lastSyncedState.current.workouts;
          
          if (remoteStr !== currentStr && remoteStr !== lastSyncedStr) {
            const lastSynced = JSON.parse(lastSyncedStr || "[]");
            // Only update if no local changes pending or remote has legitimate updates
            if (currentStr === lastSyncedStr || workoutsData.length > lastSynced.length) {
              useAppStore.setState({ workouts: workoutsData });
              lastSyncedState.current.workouts = remoteStr;
            }
          }
        }
      },
    });

    return unsubscribe;
  }, [user, setProfile, setTargets]); // Remove state dependencies to prevent re-subscription
}

