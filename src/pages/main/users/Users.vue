<template>
    <div>
        <q-btn class="q-mt-sm q-mr-sm text-capitalize" 
               color="primary"
               label="Add User" 
               size="sm"
               glossy
               @click="openDialog('add')"
               :icon="icons.plus"/>
         <q-btn class="q-mt-sm q-mr-sm text-capitalize"
                outline
                color="primary" 
                icon="refresh" 
                label="Refresh"
                size="sm"
                glossy
                @click="getAllUsers()"/>
        <q-table
        class="my-sticky-header-table"
        title="Users"
        dense
        bordered
        flat
        :rows="users"
        :columns="columns"
        row-key="logonId"
        :loading="loading"
        :pagination="user_pagination"
        :filter="filter"
        v-model:selected="selected"
      >
        <template v-slot:body-cell-agreement_value="props">
          <q-td :props="props">
            <div>
            <q-icon :name="icons.rupee"/>
                {{props.row.agreement_value.toLocaleString('en-IN')}}
            </div>
          </q-td>
        </template>
        <template v-slot:body-cell-actions="props">
          <q-td :props="props">
            <div >
               <q-icon class="q-ma-sm q-pa-none pointer" color="red" :name="icons.delete" @click="deleteUser(props.row)"/>
               <q-icon class="q-ma-none q-pa-none pointer" color="primary" :name="icons.edit" @click="editUser(props.row)"/>
            </div>
          </q-td>
        </template>
        <template v-slot:top-right>
          <q-input
            borderless
            dense
            outlined
            debounce="300"
            v-model="filter"
            placeholder="Search Site"
          >
          <template v-slot:append>
              <q-icon name="search" />
          </template>
          </q-input>
        </template>
      </q-table>

      <q-dialog
        v-model="open"
        persistent
        @before-show="beforeShow"
        @hide="onHide"
        ref="newUserRef"
      >
        <q-card style="width: 700px; max-width: 80vw;">
          <q-bar class="bg-primary glossy text-white text-weight-light text-subtitle2">
            {{ dialog_label }}
            <q-space />
            <q-btn dense flat icon="close" v-close-popup>
              <q-tooltip>Close</q-tooltip>
            </q-btn>
          </q-bar>

          <q-card-section>
            <q-form @submit="addUser" @reset="reset" class="q-gutter-md">
              <q-input
                dense
                outlined
                v-model="user.name"
                label="Name"
                full-width
                lazy-rules
                :rules="[val => (val && val.length > 0) || 'Enter Site name']"
              />
              <q-input
                dense
                outlined
                v-model="user.displayName"
                label="Display Name"
                full-width
                lazy-rules
                :rules="[val => (val && val.length > 0) || 'Enter Display Name']"
              />
              <q-input
                dense
                outlined
                v-model="user.logonId"
                label="Logon Id"
                full-width
                lazy-rules
                :rules="[val => (val && val.length > 0) || 'Logon Id']"
              />
              <q-input v-if="mode === 'add'"
                dense
                outlined
                v-model="user.password"
                label="Password"
                full-width
                lazy-rules
                :rules="[val => (val && val.length > 0) || 'Enter Password']"
              />
              <q-select
                    dense
                    outlined
                    v-model="user.status"
                    :options="statusList"
                    label="Status"
                    lazy-rules
                    :rules="[
                      val => (val && val.length > 0) || 'Enter status'
                    ]"
                  />


              <div>
                <q-space />
                <q-btn
                  dense
                  glossy
                  size="sm"
                  :label="mode === 'add' ? 'Add' : 'Update'"
                  type="submit"
                  color="primary"
                  class="text-capitalize q-px-md"
                />

                <q-btn
                  v-if="mode === 'add'"
                  dense
                  glossy
                  size="sm"
                  label="Reset"
                  type="reset"
                  class="text-capitalize q-px-md q-mx-sm"
                />
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </q-dialog>
    </div>
</template>

<script>
import UserService from "../../../services/UserService"
import { commonMixin } from "../../../mixin/common"
import { fasPlus, fasEdit } from "@quasar/extras/fontawesome-v5";
import { matDelete} from "@quasar/extras/material-icons";
import { ref } from 'vue'
export default {
  name: 'Users',
  mixins: [commonMixin],
  setup () {
    return {
      selected: ref([]),
      columns: [
        {
          name: "name",
          required: true,
          label: "Name",
          align: "left",
          field: row => row.name,
          format: val => `${val}`,
          sortable: true
        },
        {name: "displayName",  align: "left", label: "Display Name", field: "displayName", sortable: true},
        {name: "logonId",  align: "left", label: "Logon ID", field: "logonId", sortable: true},
        {name: "status",  align: "left", label: "Status", field: "status", sortable: true},
        {name: "createdTimestamp",  align: "left", label: "Created", field: "createdTimestamp", sortable: true},
        {name: "actions", required: true, label: "Actions", field: "actions"}
      ],
      icons: {
        plus: fasPlus,
        edit: fasEdit,
        delete: matDelete
      }
    }
  },
  components: {
  },
  created() {},
  mounted() {
   this.getAllUsers()
  },
  data() {
    return {
      client_id: this.getClientId(),
      user_pagination: { rowsPerPage: 10 },
      filter: "",
      loading: true,
      users: [],
      user: this.newUser(),
      open: false,
      mode: "add",
      dialog_label: "New User",
      statusList: ['ACTIVE', 'BLOCKED']
    };
  },
  methods: {
    newUser() {
      return {
        id: null,
        clientId: this.client_id,
        name:'',
        displayName: '',
        status: '',
        logonId:'',
        password:null
      }
    },
    getAllUsers() {
      this.loading = true;
      UserService.all(this.client_id)
        .then(response => {
        this.users.splice(0, this.users.length)
        this.users = response;
        this.loading = false;
      }).catch(err => {
        this.loading = false;
      });
    },
    addUser() {
      this.user.clientId = this.client_id
      UserService.create(this.user)
        .then(response => {
          if(this.mode === 'add') {
            this.users.unshift(response)
            this.success("User create Successfully")
          } else if(this.mode === 'edit'){
             this.success("User Updated Successfully")
          }
          this.$refs.newUserRef.hide();
      }).catch(err => {
        this.loading = false;
        this.fail(this.getErrorMessage(err))
      });
    },
    editUser(row){
      this.user = row
      this.dialog_label = "Update User";
      this.mode = 'edit'
      this.open = true;
    },
    deleteUser(row) {
      this.$q
        .dialog({
          title: "Are You Sure?",
          message: "This will delete the user permanently.",
          cancel: true,
          persistent: true,
        })
        .onOk(() => {
          UserService.deleteUser(
            this.client_id,
            row.id
          )
            .then((response) => {
              if (response === 0) {
                this.getAllUsers();
                this.success("User has been deleted");
              }
            })
            .catch((err) => {
              this.loading = false;
              this.fail(this.getErrorMessage(err));
            });
        })
        .onOk(() => {})
        .onCancel(() => {})
        .onDismiss(() => {});
    },
    beforeShow() {},
    openDialog(mode) {
      this.mode = mode;
      if (this.mode === "add") {
        this.dialog_label = "New User";
      }
      this.open = true;
    },
    onHide() {
      this.reset();
      this.mode='add'
    },
    reset() {
      this.user = this.newUser();
    }
  }
};
</script>