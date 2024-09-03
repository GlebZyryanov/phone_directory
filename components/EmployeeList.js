const EmployeeList = {
  props: ["employees"],
  data() {
    return {
      employeeToEdit: null,
      phoneToEdit: null,
      newPhones: {},
    };
  },
  methods: {
    async editEmployee(employee) {
      this.employeeToEdit = { ...employee };
    },
    async updateEmployee() {
      const options = {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(this.employeeToEdit),
      };
      try {
        const response = await fetch(`${apiUrl}/employees.php`, options);
        if (response.ok) {
          const index = this.employees.findIndex(emp => emp.id === this.employeeToEdit.id);
          if (index !== -1) {
            this.employees[index] = this.employeeToEdit;
          }
          this.$emit("employee-updated");
          this.employeeToEdit = null;
        }
      } catch (error) {
        console.error("Network error, saving action to localStorage");
        this.$root.saveOfflineAction(`${apiUrl}/employees.php`, options);
        const index = this.employees.findIndex(emp => emp.id === this.employeeToEdit.id);
        if (index !== -1) {
          this.employees[index] = this.employeeToEdit;
        }
        this.$emit("employee-updated");
        this.employeeToEdit = null;
      }
    },
    async deleteEmployee(id) {
      const options = {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      };

      try {
        await fetch(`${apiUrl}/employees.php`, options);
        this.$emit("employee-deleted");
      } catch (error) {
        console.error("Network error, saving action to localStorage");
        this.$root.saveOfflineAction(`${apiUrl}/employees.php`, options);
        this.$emit("employee-deleted");
      }

    },
    cancelEditEmployee() {
      this.employeeToEdit = null;
    },
    async addPhone(employee_id) {
      const options = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employee_id,
          phone_number: this.newPhones[employee_id],
        }),
      };
      try {
        const response = await fetch(`${apiUrl}/phones.php`, options);
        if (response.ok) {
          this.$emit("phone-added");
          this.newPhones[employee_id] = "";
        }
      } catch (error) {
        console.error("Network error, saving action to localStorage");
        this.$root.saveOfflineAction(`${apiUrl}/phones.php`, options);
        this.$emit("phone-added");
        this.newPhones[employee_id] = "";
      }

    },
  },
  template: `
      <div class="employee-container">
        <div class="employee-card" v-for="employee in employees" :key="employee.id">
          <div class = "employee-info"> 
            <h2>{{ employee.name }} ({{ employee.position }})</h2>
            <div class="employee-buttons">
                <button @click="editEmployee(employee)">Редактировать информацию о сотруднике</button>
                <div>
                    <div class="employee-edit" v-if="employeeToEdit && employeeToEdit.id === employee.id">
                        <input v-model="employeeToEdit.name" placeholder="Имя" />
                        <input v-model="employeeToEdit.position" placeholder="Должность" />
                
                        
                            <button @click="updateEmployee">Сохранить</button>
                            <button @click="cancelEditEmployee">Отмена</button>
                        
                    </div>
                </div>
                <button @click="deleteEmployee(employee.id)">Удалить</button>
            </div>
        </div>
          
          <phone-form :employee="employee" @phone-added="$emit('phone-added')"></phone-form>
        </div>
      </div>
    `,
};
