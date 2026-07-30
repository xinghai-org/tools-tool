const activeTaskIds = new Set()

export const taskManager = {
  addTask(taskId) {
    activeTaskIds.add(taskId)
  },

  stopTask(taskId) {
    activeTaskIds.delete(taskId)
  },

  isActive(taskId) {
    return activeTaskIds.has(taskId)
  }
}