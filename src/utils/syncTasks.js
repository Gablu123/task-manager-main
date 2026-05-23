import { doc, setDoc, deleteDoc } from "firebase/firestore";
import { db as firebaseDB } from "../firebase/config";

let isSyncing = false;

export const syncTasks = async (allTasks, dispatch, markTaskSynced, removeTaskLocally) => {

  if (isSyncing) return;

  const itemsToSync = allTasks.filter(
    (t) => t.syncStatus === "pending" || t.syncStatus === "deleted"
  );

  if (itemsToSync.length === 0) return;

  isSyncing = true;

  const operationalSnapshot = JSON.parse(JSON.stringify(itemsToSync));

  for (let task of operationalSnapshot) {
    try {
      if (task.syncStatus === "pending") {
        await setDoc(doc(firebaseDB, "tasks", task.id), {
          title: task.title,
          completed: task.completed,
        });
        dispatch(markTaskSynced(task.id));
      }

      if (task.syncStatus === "deleted") {
        await deleteDoc(doc(firebaseDB, "tasks", task.id));
        dispatch(removeTaskLocally(task.id));
      }
    } catch (err) {
      console.log("Sync failed for individual task item:", task.id, err);
      break; 
    }
  }

  isSyncing = false;
};