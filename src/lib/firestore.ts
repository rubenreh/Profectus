import {
  doc,
  setDoc,
  getDoc,
  collection,
  query,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  type DocumentData,
} from "firebase/firestore";
import { db } from "./firebase";
import type { UserProfile, MacroTargets, WeightEntry, FoodItem, DiaryEntry, WorkoutSession, ChatMessage, ChatConversation } from "./types";

const COLLECTIONS = {
  profile: "profile",
  targets: "targets",
  weights: "weights",
  foods: "foods",
  diary: "diary",
  workouts: "workouts",
  chatConversations: "chatConversations",
} as const;

export async function syncProfileToFirestore(userId: string, profile: UserProfile | undefined) {
  if (!userId) return;
  if (profile) {
    await setDoc(doc(db, COLLECTIONS.profile, userId), profile);
  } else {
    await deleteDoc(doc(db, COLLECTIONS.profile, userId));
  }
}

export async function syncTargetsToFirestore(userId: string, targets: MacroTargets | undefined) {
  if (!userId) return;
  if (targets) {
    await setDoc(doc(db, COLLECTIONS.targets, userId), targets);
  } else {
    await deleteDoc(doc(db, COLLECTIONS.targets, userId));
  }
}

export async function syncWeightsToFirestore(userId: string, weights: WeightEntry[]) {
  if (!userId) return;
  const weightsRef = collection(db, COLLECTIONS.weights);
  const q = query(weightsRef);
  const snapshot = await getDocs(q);
  const userWeights = snapshot.docs.filter((d) => d.data().userId === userId);
  
  // Delete removed entries
  const currentIds = new Set(weights.map((w) => w.id));
  await Promise.all(userWeights.filter((d) => !currentIds.has(d.id)).map((d) => deleteDoc(d.ref)));
  
  // Upsert all weights (use app ID as Firestore doc ID)
  await Promise.all(weights.map((w) => setDoc(doc(db, COLLECTIONS.weights, w.id), { ...w, userId })));
}

export async function syncFoodsToFirestore(userId: string, foods: FoodItem[]) {
  if (!userId) return;
  const foodsRef = collection(db, COLLECTIONS.foods);
  const q = query(foodsRef);
  const snapshot = await getDocs(q);
  const userFoods = snapshot.docs.filter((d) => d.data().userId === userId);
  
  const currentIds = new Set(foods.map((f) => f.id));
  await Promise.all(userFoods.filter((d) => !currentIds.has(d.id)).map((d) => deleteDoc(d.ref)));
  
  // Sanitize foods to remove undefined fields
  const sanitizedFoods = foods.map((f) => {
    const sanitized: any = { ...f, userId };
    Object.keys(sanitized).forEach(key => {
      if (sanitized[key] === undefined) {
        delete sanitized[key];
      }
    });
    return sanitized;
  });
  
  await Promise.all(sanitizedFoods.map((f) => setDoc(doc(db, COLLECTIONS.foods, f.id), f)));
}

export async function syncDiaryToFirestore(userId: string, diary: DiaryEntry[]) {
  if (!userId) return;
  const diaryRef = collection(db, COLLECTIONS.diary);
  const q = query(diaryRef);
  const snapshot = await getDocs(q);
  const userDiary = snapshot.docs.filter((d) => d.data().userId === userId);
  
  const currentIds = new Set(diary.map((d) => d.id));
  await Promise.all(userDiary.filter((d) => !currentIds.has(d.id)).map((d) => deleteDoc(d.ref)));
  
  // Sanitize diary entries to remove undefined fields (Firebase doesn't accept undefined)
  const sanitizedDiary = diary.map((d) => {
    const sanitizedFood: any = { ...d.food };
    // Remove undefined fields from food
    Object.keys(sanitizedFood).forEach(key => {
      if (sanitizedFood[key] === undefined) {
        delete sanitizedFood[key];
      }
    });
    return {
      ...d,
      food: sanitizedFood,
      userId,
    };
  });
  
  await Promise.all(sanitizedDiary.map((d) => setDoc(doc(db, COLLECTIONS.diary, d.id), d)));
}

export async function syncWorkoutsToFirestore(userId: string, workouts: WorkoutSession[]) {
  if (!userId) return;
  const workoutsRef = collection(db, COLLECTIONS.workouts);
  const q = query(workoutsRef);
  const snapshot = await getDocs(q);
  const userWorkouts = snapshot.docs.filter((d) => d.data().userId === userId);
  
  const currentIds = new Set(workouts.map((w) => w.id));
  await Promise.all(userWorkouts.filter((d) => !currentIds.has(d.id)).map((d) => deleteDoc(d.ref)));
  await Promise.all(workouts.map((w) => setDoc(doc(db, COLLECTIONS.workouts, w.id), { ...w, userId })));
}

export async function loadProfileFromFirestore(userId: string): Promise<UserProfile | undefined> {
  const docRef = doc(db, COLLECTIONS.profile, userId);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? (docSnap.data() as UserProfile) : undefined;
}

export async function loadTargetsFromFirestore(userId: string): Promise<MacroTargets | undefined> {
  const docRef = doc(db, COLLECTIONS.targets, userId);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? (docSnap.data() as MacroTargets) : undefined;
}

export async function loadWeightsFromFirestore(userId: string): Promise<WeightEntry[]> {
  const weightsRef = collection(db, COLLECTIONS.weights);
  const q = query(weightsRef);
  const snapshot = await getDocs(q);
  return snapshot.docs
    .filter((d) => d.data().userId === userId)
    .map((d) => {
      const data = d.data();
      return { id: d.id, date: data.date, weightKg: data.weightKg } as WeightEntry;
    });
}

export async function loadFoodsFromFirestore(userId: string): Promise<FoodItem[]> {
  const foodsRef = collection(db, COLLECTIONS.foods);
  const q = query(foodsRef);
  const snapshot = await getDocs(q);
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
  const diaryRef = collection(db, COLLECTIONS.diary);
  const q = query(diaryRef);
  const snapshot = await getDocs(q);
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
  const workoutsRef = collection(db, COLLECTIONS.workouts);
  const q = query(workoutsRef);
  const snapshot = await getDocs(q);
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
  if (!userId) return () => {};

  const unsubscribes: (() => void)[] = [];

  if (callbacks.onProfile) {
    const unsub = onSnapshot(doc(db, COLLECTIONS.profile, userId), (doc) => {
      callbacks.onProfile?.(doc.exists() ? (doc.data() as UserProfile) : undefined);
    });
    unsubscribes.push(unsub);
  }

  if (callbacks.onTargets) {
    const unsub = onSnapshot(doc(db, COLLECTIONS.targets, userId), (doc) => {
      callbacks.onTargets?.(doc.exists() ? (doc.data() as MacroTargets) : undefined);
    });
    unsubscribes.push(unsub);
  }

  if (callbacks.onWeights) {
    const unsub = onSnapshot(collection(db, COLLECTIONS.weights), (snapshot) => {
      const weights = snapshot.docs
        .filter((d) => d.data().userId === userId)
        .map((d) => {
          const data = d.data();
          return { id: d.id, date: data.date, weightKg: data.weightKg } as WeightEntry;
        });
      callbacks.onWeights?.(weights);
    });
    unsubscribes.push(unsub);
  }

  if (callbacks.onFoods) {
    const unsub = onSnapshot(collection(db, COLLECTIONS.foods), (snapshot) => {
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
    });
    unsubscribes.push(unsub);
  }

  if (callbacks.onDiary) {
    const unsub = onSnapshot(collection(db, COLLECTIONS.diary), (snapshot) => {
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
    });
    unsubscribes.push(unsub);
  }

  if (callbacks.onWorkouts) {
    const unsub = onSnapshot(collection(db, COLLECTIONS.workouts), (snapshot) => {
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
    });
    unsubscribes.push(unsub);
  }

  return () => {
    unsubscribes.forEach((unsub) => unsub());
  };
}

// Chat conversation functions
export async function loadChatConversationFromFirestore(userId: string): Promise<ChatConversation | undefined> {
  if (!userId) return undefined;
  const conversationsRef = collection(db, COLLECTIONS.chatConversations);
  const q = query(conversationsRef);
  const snapshot = await getDocs(q);
  const userConversation = snapshot.docs.find((d) => d.data().userId === userId);
  
  if (!userConversation) return undefined;
  
  const data = userConversation.data();
  return {
    id: userConversation.id,
    userId: data.userId,
    messages: data.messages || [],
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  } as ChatConversation;
}

export async function syncChatConversationToFirestore(userId: string, conversation: ChatConversation) {
  if (!userId) return;
  
  const conversationsRef = collection(db, COLLECTIONS.chatConversations);
  const q = query(conversationsRef);
  const snapshot = await getDocs(q);
  const existingConversation = snapshot.docs.find((d) => d.data().userId === userId);
  
  if (existingConversation) {
    await updateDoc(existingConversation.ref, {
      messages: conversation.messages,
      updatedAt: conversation.updatedAt,
    });
  } else {
    await setDoc(doc(db, COLLECTIONS.chatConversations, conversation.id), {
      ...conversation,
      userId,
    });
  }
}

