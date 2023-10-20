<template>
    <div>
       
        <q-table
        class="my-sticky-header-table"
        title="Drive"
        dense
        bordered
        flat
        :rows="directories"
        :columns="columns"
        row-key="id"
        :loading="loading"
        :pagination="directory_pagination"
        selection="single"
        :filter="filter"
      >
        <template v-slot:body-cell-actions="props" v-if="admin">
          <q-td :props="props">
            <div >
               <q-icon class="q-ma-sm q-pa-none pointer" color="red" :name="icons.delete" @click="deleteDirectory(props.row)"/>
               <q-icon class="q-ma-none q-pa-none pointer" color="primary" :name="icons.edit" @click="editDirectory(props.row)"/>
            </div>
          </q-td>
        </template>
        <template v-slot:body-selection="props">
          <q-btn class="pointer" :size="directory_size" color="yellow-14" flat :icon="icons.dir" @click="openDirectory(props)">
            <q-tooltip>Open this folder</q-tooltip>
          </q-btn>
        </template>
        <template v-slot:top-right>
          <q-input
            borderless
            dense
            outlined
            debounce="300"
            v-model="filter"
            placeholder="Search Directory"
          >
          <template v-slot:append>
              <q-icon name="search" />
          </template>
          </q-input>
        </template>
         <template v-slot:top-left>
          <q-icon class="q-mb-md q-mr-md" color="blue" size="lg" :name = "icons.drive"/>
          <span class="text-h5"></span>
          <q-space/>
           <q-btn v-if="admin" class="q-ml-sm q-mr-sm q-mb-sm text-capitalize" 
               color="primary"
               size="xs"
               outline
               @click="openDialog('add')"
               :icon="icons.plus">
               <q-tooltip>Create new directory</q-tooltip>
           </q-btn>
         <q-btn class="q-mr-sm text-capitalize q-mb-sm"
                color="primary" 
                icon="refresh" 
                size="xs"
                outline
                @click="getAllDirectories()">
                <q-tooltip>Refresh</q-tooltip>
           </q-btn>
        </template>
      </q-table>

      <q-dialog
        v-model="open"
        persistent
        @before-show="beforeShow"
        @hide="onHide"
        ref="newDirectoryRef"
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
            <q-form @submit="createDirectory" @reset="reset" class="q-gutter-md">
              <q-input
                dense
                outlined
                v-model="directory.name"
                label="Name"
                full-width
                lazy-rules
                :rules="[val => (val && val.length > 0) || 'Enter directory name']"
              />
              <q-input
                dense
                outlined
                v-model="directory.description"
                label="Description"
                full-width
                lazy-rules
                :rules="[val => (val && val.length > 10) || 'Enter directory description']"
              />
              <q-select
                    dense
                    outlined
                    v-model="directory.category"
                    :options="categoryList"
                    label="Category"
                    lazy-rules
                    :rules="[
                      val => (val && val.length > 0) || 'Select a category'
                    ]"
                  />
              <q-input v-if="directory.category==='Other'"
                dense
                outlined
                v-model="otherCategory"
                label="Ener a Category"
                full-width
                lazy-rules
                :rules="[val => (val && val.length > 2) || 'Enter a category']"
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
import DriveService from "../../../services/DriveService"
import { commonMixin } from "../../../mixin/common"
import { fasPlus, fasEdit, fasFolder } from "@quasar/extras/fontawesome-v5";
import { matDelete, matFolder, matCloud} from "@quasar/extras/material-icons";
import { ref } from 'vue'
export default {
  name: 'Drive',
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
        {name: "description",  align: "left", label: "Description", field: "description", sortable: true},
        {name: "category",  align: "left", label: "Category", field: "category", sortable: true},
        {name: "createdTimestamp",  align: "left", label: "Created", field: "createdTimestamp", sortable: true}
      ],
      icons: {
        plus: fasPlus,
        edit: fasEdit,
        delete: matDelete,
        directory:matFolder,
        dir:fasFolder,
        drive: matCloud
      }
    }
  },
  components: {
  },
  created() {
    if(this.admin){
      this.columns.push( {name: "actions", required: true, label: "Actions", field: "actions"})
    }
  },
  mounted() {
   this.getAllDirectories()
  },
  data() {
    return {
      client_id: this.getClientId(),
      admin: this.isAdmin(),
      directory_size: 'md',
      otherCategory: '',
      directory_pagination: { rowsPerPage: 15 },
      filter: "",
      loading: true,
      directories: [],
      directory: this.newDirectory(),
      open: false,
      mode: "add",
      dialog_label: "New Directory",
      categoryList: ['Personal', 'Bank', 'Firm', 'GST', 'Income Tax', 'Site', 'Home', 'Land & Property', 'Other']
    };
  },
  methods: {
    newDirectory() {
      return {
        id: null,
        clientId: this.client_id,
        name:'',
        description: '',
        category: ''
      }
    },
    openDirectory(prop){
      console.log(JSON.stringify(prop.row.id))
      this.$router.push({ name: "directoryFiles", params: { directory_id: prop.row.id}});
    },
    getAllDirectories() {
      this.loading = true;
      DriveService.all(this.client_id)
        .then(response => {
        this.directories.splice(0, this.directories.length)
        this.directories = response;
        this.loading = false;
      }).catch(err => {
        this.loading = false;
      });
    },
    createDirectory() {
      this.directory.clientId = this.client_id
      if(this.directory.category === 'Other')
        this.directory.category = this.otherCategory
      DriveService.create(this.directory)
        .then(response => {
          if(this.mode === 'add') {
            this.directories.unshift(response)
            this.success("Directory create Successfully")
          } else if(this.mode === 'edit'){
             this.success("Directory Updated Successfully")
          }
          this.$refs.newDirectoryRef.hide();
      }).catch(err => {
        this.loading = false;
        this.fail(this.getErrorMessage(err))
      });
    },
    editDirectory(row){
      this.directory = row
      this.dialog_label = "Update Directory";
      this.mode = 'edit'
      this.open = true;
    },
    deleteDirectory(row) {
      this.$q
        .dialog({
          title: "Are You Sure?",
          message: "This will delete this directory permanently.",
          cancel: true,
          persistent: true,
        })
        .onOk(() => {
          DriveService.deleteDirectory(
            this.client_id,
            row.id
          )
            .then((response) => {
              if (response === 0) {
                this.getAllDirectories();
                this.success("Directory has been deleted");
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
        this.directory = this.newDirectory()
        this.dialog_label = "New Directory";
      }
      this.open = true;
    },
    onHide() {
      this.reset();
      this.mode='add'
    },
    reset() {
      this.user = this.newDirectory();
    }
  }
};
</script>
