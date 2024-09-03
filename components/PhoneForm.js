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
      const options = {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(this.phoneToEdit),
      };

      try {
        const response = await fetch(`${apiUrl}/phones.php`, options);
        if (response.ok) {
          const index = this.employee.phones.findIndex(phone => phone.id === this.phoneToEdit.id);
          if (index !== -1) {
            this.employee.phones[index] = this.phoneToEdit;
          }
          this.$emit("phoneUpdated");
          this.phoneToEdit = null;
        }
      } catch (error) {
        console.error("Network error, saving action to localStorage");
        this.$root.saveOfflineAction(`${apiUrl}/phones.php`, options);
        const index = this.employee.phones.findIndex(phone => phone.id === this.phoneToEdit.id);
        if (index !== -1) {
          this.employee.phones[index] = this.phoneToEdit;
        }
        this.phoneToEdit = null;
      }

    },
    cancelEditPhone() {
      this.phoneToEdit = null;
    },
    async deletePhone(id) {
      const options = {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      };

      try {
        await fetch(`${apiUrl}/phones.php`, options);
        this.employee.phones = this.employee.phones.filter((phone) => phone.id !== id);
        this.$emit("phoneDeleted");
      } catch (error) {
        console.error("Network error, saving action to localStorage");
        this.$root.saveOfflineAction(`${apiUrl}/phones.php`, options);
        this.employee.phones = this.employee.phones.filter((phone) => phone.id !== id);
        this.$emit("phoneDeleted");
      }

    },
    async addPhone() {
      const newPhone= {
          employee_id: this.employee.id,
          phone_number: this.newPhone,
          id: Date.now(),  //назначаем временный ID
      };
      this.employee.phones = this.employee.phones || []; //массив телефонов должен существовать
      const options = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPhone),
      };

      try {
        const response = await fetch(`${apiUrl}/phones.php`, options);
        if (response.ok) {
          const addedPhone = await response.json();
          this.employee.phones.push(addedPhone);
          this.$emit("phoneAdded");
          this.newPhone = "";
        }
      } catch (error) {
        console.error("Network error, saving action to localStorage");
        this.$root.saveOfflineAction(`${apiUrl}/phones.php`, options);
        this.employee.phones.push(newPhone); //вставляем номер в массив телефонов сотрудника
        localStorage.setItem("employees", JSON.stringify(this.$root.employees)); //обновляем localStorage
        this.newPhone = ""; //очищаем поле ввода
        this.$emit("phoneAdded"); //посылаем событие "phoneAdded"
        
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
