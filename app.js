const apiUrl = "http://localhost:8000/api";

const app = Vue.createApp({
  data() {
    return {
      employees: [],
      offlineActions: JSON.parse(localStorage.getItem("offlineActions")) || [],
    };
  },
  methods: {
    async fetchEmployees() {
      try {
        const response = await fetch(`${apiUrl}/employees.php`);
        this.employees = await response.json();
        for (const employee of this.employees) {
          const res = await fetch(
            `${apiUrl}/phones.php?employee_id=${employee.id}`
          );
          const phones = await res.json();
          employee.phones = Array.isArray(phones) ? phones : [];
        }
        localStorage.setItem("employees", JSON.stringify(this.employees));
      } catch (error) {
        console.error(
          "Error connecting to server. Loading data from local storage:",
          error
        );
        this.employees = JSON.parse(localStorage.getItem("employees")) || [];
      }
    },
    async syncOfflineActions() {
      console.log("syncing offline actions...");
      const failedActions=[];
      for (const action of this.offlineActions) {
        try {
          const response = await fetch(action.url, action.options);
          if(!response.ok) {
            throw new Error(`Failed to sync action: ${response.statusText}`);
          }
        } catch (error) {
          console.error("Error syncing action:", error);
          failedActions.push(action);
        }
      }
      this.offlineActions = failedActions;
      localStorage.setItem("offlineActions", JSON.stringify(this.offlineActions));
      console.log("Sync complete. Remaining offline actions:", this.offlineActions);
      // this.offlineActions = [];
      // localStorage.removeItem("offlineActions");
    },
    saveOfflineAction(url, options) {
      this.offlineActions.push({ url, options });
      localStorage.setItem(
        "offlineActions",
        JSON.stringify(this.offlineActions)
      );
    },
    async checkServerStatus() {
      try {
        const response = await fetch(`${apiUrl}/employees.php`);
        if (response.ok) {
          console.log("Server is online. Syncing offline actions...");
          await this.syncOfflineActions();
        }
      } catch (error) {
        console.log("Server is still offline.");
      }
    },
  },
  mounted() {
    this.fetchEmployees();
    setInterval(this.checkServerStatus, 5000);
    //событие online не подходит для локальной разработки
    // window.addEventListener('online', async () => {
    //   console.log("Connection restored. Syncing offline actions...");
    //   await this.syncOfflineActions();
    // });
    // window.addEventListener("online", () => {
    //   this.syncOfflineActions();
    // });
  },
});

app.component("employee-form", EmployeeForm);
app.component("employee-list", EmployeeList);
app.component("phone-form", PhoneForm);

app.mount("#app");
