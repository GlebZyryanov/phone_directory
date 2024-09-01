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
      const response = await fetch(`${apiUrl}/employees.php`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(this.employeeToEdit),
      });
      if (response.ok) {
        this.$emit("employee-updated");
        this.employeeToEdit = null;
      }
    },
    async deleteEmployee(id) {
      await fetch(`${apiUrl}/employees.php`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      this.$emit("employee-deleted");
    },
    cancelEditEmployee() {
      this.employeeToEdit = null;
    },
    async addPhone(employee_id) {
      const response = await fetch(`${apiUrl}/phones.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employee_id,
          phone_number: this.newPhones[employee_id],
        }),
      });
      if (response.ok) {
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
