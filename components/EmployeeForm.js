

const EmployeeForm = {
    data() {
      return {
        
        newEmployee: { name: "", position: "" },
        errors: {},
      };
    },
    methods: {
      validateEmployee() {
        const errors = {};
        if (!this.newEmployee.name || this.newEmployee.name.length < 3) {
          errors.name = "Имя должно содержать как минимум 3 символа.";
        }
        if (!this.newEmployee.position || this.newEmployee.position.length < 3) {
          errors.position = "Должность должна содержать как минимум 3 символа.";
        }
        this.errors = errors;
        return Object.keys(errors).length === 0;
      },
      async addEmployee() {
        if (!this.validateEmployee()) return;
      
        const newEmployee = { ...this.newEmployee, id: Date.now() }; // Присваиваем временный ID
        this.$root.addEmployeeToLocal(newEmployee);
      
        const options = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newEmployee),
        };
      
        try {
          const response = await fetch(`${apiUrl}/employees.php`, options);
          const savedEmployee = await response.json();
          if (response.ok) {
            // Обновляем временный ID на серверный ID
            this.$root.updateEmployeeInLocal(savedEmployee);
          }
        } catch (error) {
          console.error("Network error, saving action to localStorage");
          this.$root.saveOfflineAction(`${apiUrl}/employees.php`, options);
        }
        
        this.$emit("employee-added");
        this.newEmployee = { name: "", position: "" };
      },
    },
    template: `
      <form @submit.prevent="addEmployee">
        <input v-model="newEmployee.name" placeholder="Введите имя сотрудника..." />
        <div v-if="errors.name" class="error">{{ errors.name }}</div>
        <input v-model="newEmployee.position" placeholder="Введите должность..." />
        <div v-if="errors.position" class="error">{{ errors.position }}</div>
        <div class="button-container">
          <button type="submit">Добавить сотрудника</button>
        </div>
      </form>
    `,
  };
  