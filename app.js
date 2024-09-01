const apiUrl = "http://localhost:8000/api";

const app = Vue.createApp({
  data() {
    return {
      employees: [],
    };
  },
  methods: {
    async fetchEmployees() {
      const response = await fetch(`${apiUrl}/employees.php`);
      this.employees = await response.json();
      for (const employee of this.employees) {
        const res = await fetch(`${apiUrl}/phones.php?employee_id=${employee.id}`);
        const phones = await res.json();
        employee.phones = Array.isArray(phones) ? phones : [];
      }
    },
  },
  mounted() {
    this.fetchEmployees();
  },
});

app.component('employee-form', EmployeeForm);
app.component('employee-list', EmployeeList);
app.component('phone-form', PhoneForm);

app.mount("#app");