const apiUrl = "http://localhost:8000/api";

const app = Vue.createApp({
  data() {
    return {
      employees: JSON.parse(localStorage.getItem("employees")) || [],
      offlineActions: JSON.parse(localStorage.getItem("offlineActions")) || [],
    };
  },
  methods: {
    async fetchEmployees() {
      try {
        
        const response = await fetch(`${apiUrl}/employees.php`);
        this.employees = await response.json();
        for (const employee of this.employees) {
          const res = await fetch(`${apiUrl}/phones.php?employee_id=${employee.id}`);
          const phones = await res.json();
          employee.phones = Array.isArray(phones) ? phones : [];
        }
        localStorage.setItem("employees", JSON.stringify(this.employees));
      } catch (error) {
        console.error("Error connecting to server. Loading data from local storage:", error);
        this.employees = JSON.parse(localStorage.getItem("employees")) || [];
      }
    },
    async syncOfflineActions() {
      const failedActions = [];
      for (const action of this.offlineActions) {
        try {
          const response = await fetch(action.url, action.options);
          if (!response.ok) {
            throw new Error(`Failed to sync action: ${response.statusText}`);
          }
        } catch (error) {
          console.error("Error syncing action:", error);
          failedActions.push(action);
        }
      }
      this.offlineActions = failedActions;
      localStorage.setItem("offlineActions", JSON.stringify(this.offlineActions));
      if (failedActions.length === 0) {
        console.log("All actions synced. Reloading employees from server...");
        await this.fetchEmployees();
      }
    },
    saveOfflineAction(url, options) {
      this.offlineActions.push({ url, options });
      localStorage.setItem("offlineActions", JSON.stringify(this.offlineActions));
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
    addEmployeeToLocal(employee) {
      this.employees.push(employee);
      localStorage.setItem("employees", JSON.stringify(this.employees));
    },
    updateEmployeeInLocal(updatedEmployee) {
      const index = this.employees.findIndex(emp => emp.id === updatedEmployee.id);
      if (index !== -1) {
        this.employees[index] = updatedEmployee;
        localStorage.setItem("employees", JSON.stringify(this.employees));
      }
    },
    deleteEmployeeFromLocal(employeeId) {
      this.employees = this.employees.filter(emp => emp.id !== employeeId);
      localStorage.setItem("employees", JSON.stringify(this.employees));
    },
    addPhoneToLocal(employeeId, phone) {
      const employee = this.employees.find(emp => emp.id === employeeId);
      if (employee) {
        employee.phones.push(phone);
        localStorage.setItem("employees", JSON.stringify(this.employees));
      }
    },
    deletePhoneFromLocal(employeeId, phoneId) {
      const employee = this.employees.find(emp => emp.id === employeeId);
      if (employee) {
        employee.phones = employee.phones.filter(phone => phone.id !== phoneId);
        localStorage.setItem("employees", JSON.stringify(this.employees));
      }
    }
  },
  mounted() {
    this.fetchEmployees();
    setInterval(this.checkServerStatus, 50000);
  }
});

app.component("employee-form", EmployeeForm);
app.component("employee-list", EmployeeList);
app.component("phone-form", PhoneForm);

app.mount("#app");
