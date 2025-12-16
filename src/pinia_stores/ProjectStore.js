import { defineStore } from "pinia";
import ProjectService from "src/services/ProjectService";

export const projectStore = defineStore("projectStore", {
  state: () => ({
    projectsList: [],
  }),

  actions: {
    async loadProjects(client_id, force_refresh = true) {
      if (this.projectsList.length === 0 || force_refresh) {
        try {
          const response = await ProjectService.getProjectList(client_id);
          this.projectsList = response.list;
          return this.projectsList;
        } catch (err) {
          console.error("Failed to load projects", err);
          this.projectsList = [];
          throw err;
        } finally {
        }
      } else {
        return this.projectsList;
      }
    },
  },
});
