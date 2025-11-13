import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { getFirestoreClient } from "./firebase";
import type {
  ChatConversation,
  DiaryEntry,
  FoodItem,
  MacroTargets,
  UserProfile,
  WeightEntry,
  WorkoutSession,
} from "./types";

const COLLECTIONS = {
  profile: "profile",
  targets: "targets",
  weights: "weights",
  foods: "foods",
  diary: "diary",
  workouts: "workouts",
  chatConversations: "chatConversations",
} as const;

let hasWarned = false;

function ensureDb() {
  const db = getFirestoreClient();
  if (!db && typeof window !== "undefined" && !hasWarned) {
    console.warn("Firestore is not configured. Ensure Firebase environment variables are set.");
    hasWarned = true;
  }
  return db;
}

export async function syncProfileToFirestore(userId: string, profile: UserProfile | undefined) {
  const db = ensureDb();
  if (!db || !userId) return;

  if (profile) {
    await setDoc(doc(db, COLLECTIONS.profile, userId), profile);
  } else {
    await deleteDoc(doc(db, COLLECTIONS.profile, userId));
  }
}

export async function syncTargetsToFirestore(userId: string, targets: MacroTargets | undefined) {
  const db = ensureDb();
  if (!db || !userId) return;

  if (targets) {
    await setDoc(doc(db, COLLECTIONS.targets, userId), targets);
  } else {
    await deleteDoc(doc(db, COLLECTIONS.targets, userId));
  }
}

export async function syncWeightsToFirestore(userId: string, weights: WeightEntry[]) {
  const db = ensureDb();
  if (!db || !userId) return;

  const weightsRef = collection(db, COLLECTIONS.weights);
  const snapshot = await getDocs(query(weightsRef));
  const userWeights = snapshot.docs.filter((d) => d.data().userId === userId);

  const currentIds = new Set(weights.map((w) => w.id));
  await Promise.all(userWeights.filter((d) => !currentIds.has(d.id)).map((d) => deleteDoc(d.ref)));

  await Promise.all(weights.map((w) => setDoc(doc(db, COLLECTIONS.weights, w.id), { ...w, userId })));
}

export async function syncFoodsToFirestore(userId: string, foods: FoodItem[]) {
  const db = ensureDb();
  if (!db || !userId) return;

  const foodsRef = collection(db, COLLECTIONS.foods);
  const snapshot = await getDocs(query(foodsRef));
  const userFoods = snapshot.docs.filter((d) => d.data().userId === userId);

  const currentIds = new Set(foods.map((f) => f.id));
  await Promise.all(userFoods.filter((d) => !currentIds.has(d.id)).map((d) => deleteDoc(d.ref)));

  const sanitizedFoods = foods.map((f) => {
    const sanitized: any = { ...f, userId };
    Object.keys(sanitized).forEach((key) => {
      if (sanitized[key] === undefined) delete sanitized[key];
    });
    return sanitized;
  });

  await Promise.all(sanitizedFoods.map((f) => setDoc(doc(db, COLLECTIONS.foods, f.id), f)));
}

export async function syncDiaryToFirestore(userId: string, diary: DiaryEntry[]) {
  const db = ensureDb();
  if (!db || !userId) return;

  const diaryRef = collection(db, COLLECTIONS.diary);
  const snapshot = await getDocs(query(diaryRef));
  const userDiary = snapshot.docs.filter((d) => d.data().userId === userId);

  const currentIds = new Set(diary.map((d) => d.id));
  await Promise.all(userDiary.filter((d) => !currentIds.has(d.id)).map((d) => deleteDoc(d.ref)));

  const sanitizedDiary = diary.map((d) => {
    const sanitizedFood: any = { ...d.food };
    Object.keys(sanitizedFood).forEach((key) => {
      if (sanitizedFood[key] === undefined) delete sanitizedFood[key];
    });
    return { ...d, food: sanitizedFood, userId };
  });

  await Promise.all(sanitizedDiary.map((d) => setDoc(doc(db, COLLECTIONS.diary, d.id), d)));
}

export async function syncWorkoutsToFirestore(userId: string, workouts: WorkoutSession[]) {
  const db = ensureDb();
  if (!db || !userId) return;

  const workoutsRef = collection(db, COLLECTIONS.workouts);
  const snapshot = await getDocs(query(workoutsRef));
  const userWorkouts = snapshot.docs.filter((d) => d.data().userId === userId);

  const currentIds = new Set(workouts.map((w) => w.id));
  await Promise.all(userWorkouts.filter((d) => !currentIds.has(d.id)).map((d) => deleteDoc(d.ref)));
  await Promise.all(workouts.map((w) => setDoc(doc(db, COLLECTIONS.workouts, w.id), { ...w, userId })));
}

export async function loadProfileFromFirestore(userId: string): Promise<UserProfile | undefined> {
  const db = ensureDb();
  if (!db || !userId) return undefined;

  const docSnap = await getDoc(doc(db, COLLECTIONS.profile, userId));
  return docSnap.exists() ? (docSnap.data() as UserProfile) : undefined;
}

export async function loadTargetsFromFirestore(userId: string): Promise<MacroTargets | undefined> {
  const db = ensureDb();
  if (!db || !userId) return undefined;

  const docSnap = await getDoc(doc(db, COLLECTIONS.targets, userId));
  return docSnap.exists() ? (docSnap.data() as MacroTargets) : undefined;
}

export async function loadWeightsFromFirestore(userId: string): Promise<WeightEntry[]> {
  const db = ensureDb();
  if (!db || !userId) return [];

  const snapshot = await getDocs(query(collection(db, COLLECTIONS.weights)));
  return snapshot.docs
    .filter((d) => d.data().userId === userId)
    .map((d) => ({ id: d.id, date: d.data().date, weightKg: d.data().weightKg } as WeightEntry));
}

export async function loadFoodsFromFirestore(userId: string): Promise<FoodItem[]> {
  const db = ensureDb();
  if (!db || !userId) return [];

  const snapshot = await getDocs(query(collection(db, COLLECTIONS.foods)));
  return snapshot.docs
    .filter((d) => d.data().userId === userId)
    .map((d) => {
      const data = d.data();
      return {
        id: d.id,
        name: data.name,
        brand: data.brand,
        servingSize: data.servingSize,
        calories: data.calories,
        proteinGrams: data.proteinGrams,
        carbGrams: data.carbGrams,
        fatGrams: data.fatGrams,
      } as FoodItem;
    });
}

export async function loadDiaryFromFirestore(userId: string): Promise<DiaryEntry[]> {
  const db = ensureDb();
  if (!db || !userId) return [];

  const snapshot = await getDocs(query(collection(db, COLLECTIONS.diary)));
  return snapshot.docs
    .filter((d) => d.data().userId === userId)
    .map((d) => {
      const data = d.data();
      return {
        id: d.id,
        date: data.date,
        meal: data.meal,
        food: data.food,
        quantity: data.quantity,
      } as DiaryEntry;
    });
}

export async function loadWorkoutsFromFirestore(userId: string): Promise<WorkoutSession[]> {
  const db = ensureDb();
  if (!db || !userId) return [];

  const snapshot = await getDocs(query(collection(db, COLLECTIONS.workouts)));
  return snapshot.docs
    .filter((d) => d.data().userId === userId)
    .map((d) => {
      const data = d.data();
      return {
        id: d.id,
        date: data.date,
        title: data.title,
        exercises: data.exercises,
        cardio: data.cardio,
      } as WorkoutSession;
    });
}

export function subscribeToUserData(
  userId: string,
  callbacks: {
    onProfile?: (profile: UserProfile | undefined) => void;
    onTargets?: (targets: MacroTargets | undefined) => void;
    onWeights?: (weights: WeightEntry[]) => void;
    onFoods?: (foods: FoodItem[]) => void;
    onDiary?: (diary: DiaryEntry[]) => void;
    onWorkouts?: (workouts: WorkoutSession[]) => void;
  }
) {
  const db = ensureDb();
  if (!db || !userId) return () => {};

  const unsubscribes: (() => void)[] = [];

  if (callbacks.onProfile) {
    unsubscribes.push(
      onSnapshot(doc(db, COLLECTIONS.profile, userId), (docSnap) => {
        callbacks.onProfile?.(docSnap.exists() ? (docSnap.data() as UserProfile) : undefined);
      })
    );
  }

  if (callbacks.onTargets) {
    unsubscribes.push(
      onSnapshot(doc(db, COLLECTIONS.targets, userId), (docSnap) => {
        callbacks.onTargets?.(docSnap.exists() ? (docSnap.data() as MacroTargets) : undefined);
      })
    );
  }

  if (callbacks.onWeights) {
    unsubscribes.push(
      onSnapshot(collection(db, COLLECTIONS.weights), (snapshot) => {
        const weights = snapshot.docs
          .filter((d) => d.data().userId === userId)
          .map((d) => ({ id: d.id, date: d.data().date, weightKg: d.data().weightKg } as WeightEntry));
        callbacks.onWeights?.(weights);
      })
    );
  }

  if (callbacks.onFoods) {
    unsubscribes.push(
      onSnapshot(collection(db, COLLECTIONS.foods), (snapshot) => {
        const foods = snapshot.docs
          .filter((d) => d.data().userId === userId)
          .map((d) => {
            const data = d.data();
            return {
              id: d.id,
              name: data.name,
              brand: data.brand,
              servingSize: data.servingSize,
              calories: data.calories,
              proteinGrams: data.proteinGrams,
              carbGrams: data.carbGrams,
              fatGrams: data.fatGrams,
            } as FoodItem;
          });
        callbacks.onFoods?.(foods);
      })
    );
  }

  if (callbacks.onDiary) {
    unsubscribes.push(
      onSnapshot(collection(db, COLLECTIONS.diary), (snapshot) => {
        const diary = snapshot.docs
          .filter((d) => d.data().userId === userId)
          .map((d) => {
            const data = d.data();
            return {
              id: d.id,
              date: data.date,
              meal: data.meal,
              food: data.food,
              quantity: data.quantity,
            } as DiaryEntry;
          });
        callbacks.onDiary?.(diary);
      })
    );
  }

  if (callbacks.onWorkouts) {
    unsubscribes.push(
      onSnapshot(collection(db, COLLECTIONS.workouts), (snapshot) => {
        const workouts = snapshot.docs
          .filter((d) => d.data().userId === userId)
          .map((d) => {
            const data = d.data();
            return {
              id: d.id,
              date: data.date,
              title: data.title,
              exercises: data.exercises,
              cardio: data.cardio,
            } as WorkoutSession;
          });
        callbacks.onWorkouts?.(workouts);
      })
    );
  }

  return () => {
    unsubscribes.forEach((unsub) => unsub());
  };
}

export async function loadChatConversationFromFirestore(userId: string): Promise<ChatConversation | undefined> {
  const db = ensureDb();
  if (!db || !userId) return undefined;

  const snapshot = await getDocs(query(collection(db, COLLECTIONS.chatConversations)));
  const conversationDoc = snapshot.docs.find((d) => d.data().userId === userId);
  if (!conversationDoc) return undefined;

  const data = conversationDoc.data();
  return {
    id: conversationDoc.id,
    userId: data.userId,
    messages: data.messages || [],
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  } as ChatConversation;
}

export async function syncChatConversationToFirestore(userId: string, conversation: ChatConversation) {
  const db = ensureDb();
  if (!db || !userId) return;

  const snapshot = await getDocs(query(collection(db, COLLECTIONS.chatConversations)));
  const existingConversation = snapshot.docs.find((d) => d.data().userId === userId);

  if (existingConversation) {
    await updateDoc(existingConversation.ref, {
      messages: conversation.messages,
      updatedAt: conversation.updatedAt,
    });
  } else {
    await setDoc(doc(db, COLLECTIONS.chatConversations, conversation.id), { ...conversation, userId });
  }
}

