const PhoneForm = {
  props: ["employee"],
  emits: ["phoneAdded", "phoneUpdated", "phoneDeleted"],
  data() {
    return {
      phoneToEdit: null,
      newPhone: "",
    };
  },
  methods: {
    async editPhone(phone) {
      this.phoneToEdit = { ...phone };
    },
    async updatePhone() {
      const response = await fetch(`${apiUrl}/phones.php`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(this.phoneToEdit),
      });
      if (response.ok) {
        this.$emit("phone-updated");
        this.phoneToEdit = null;
      }
    },
    cancelEditPhone() {
      this.phoneToEdit = null;
    },
    async deletePhone(id) {
      await fetch(`${apiUrl}/phones.php`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const employee = this.employee;
      employee.phones = employee.phones.filter((phone) => phone.id !== id);
      this.$emit("phoneDeleted"); // Эмитируем событие phoneDeleted
    },
    async addPhone() {
      const response = await fetch(`${apiUrl}/phones.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employee_id: this.employee.id,
          phone_number: this.newPhone,
        }),
      });
      if (response.ok) {
        this.$emit("phoneAdded"); // Эмитируем событие phoneAdded
        this.newPhone = "";
      }
    },
  },
  template: `
      <form class="phone-form" @submit.prevent="addPhone">
        <input v-model="newPhone" placeholder="Номер телефона" />
        <button type="submit">Добавить</button>
      </form>
      <ul>
        <li v-for="phone in employee.phones" :key="phone.id">
          {{ phone.phone_number }}
          <div class="phone-buttons">
          <!-- Отображение кнопок редактирования и удаления только если номер не редактируется -->
        <div v-if="!phoneToEdit || phoneToEdit.id !== phone.id">
          <button @click="editPhone(phone)">Редактировать</button>
          <button @click="deletePhone(phone.id)">Удалить</button>
        </div>
        <!-- Форма редактирования -->
        <div class="phone-edit" v-if="phoneToEdit && phoneToEdit.id === phone.id">
          <input v-model="phoneToEdit.phone_number" placeholder="Редактировать" />
          <button @click="updatePhone">Сохранить</button>
          <button @click="cancelEditPhone">Отмена</button>
        </div>
          </div>
          
        </li>
      </ul>
    `
};
