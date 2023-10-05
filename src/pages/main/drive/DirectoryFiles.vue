<template>
<div>
  <div class="row bg-primary text-white text-bold">
    <span class="text-subtitle2 text-blue" style="cursor:pointer">Files://{{system_path}}</span> <q-space/>
    <q-btn flat size="sm" class="text-capitalize" :icon="icons.leftArrow" label="Back" @click="back()">
      <q-tooltip>Go back</q-tooltip>
    </q-btn>
  </div>
  

    <q-dialog
        v-model="open"
        persistent
        @hide="onHide"
        ref="newDirectoryRef"
      >
        <q-card style="width: 300px;">
          <q-bar class="bg-primary glossy text-white text-weight-light text-subtitle2">
            {{ '' }}
            <q-space />
            <q-btn dense flat icon="close" v-close-popup>
              <q-tooltip>Close</q-tooltip>
            </q-btn>
          </q-bar>

          <q-card-section>
            <q-form @submit="createFolder" @reset="reset" class="q-gutter-md">
              <q-input
                dense
                outlined
                v-model="folder_name"
                label="Folder Name"
                full-width
                lazy-rules
                :rules="[val => (val && val.length > 0) || 'Enter a name']"
              />

              <div>
                <q-space />
                <q-btn
                  dense
                  glossy
                  size="sm"
                  label="create"
                  type="submit"
                  color="primary"
                  class="text-capitalize q-px-sm float-right q-mb-sm"
                />
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </q-dialog>
      <q-dialog
        v-model="openUpload"
        persistent
        @hide="onHideUpload"
        ref="newUploadRef"
      >
        <q-card style="">
          <q-bar class="">
            {{ '' }}
            <q-space />
            <q-btn dense flat icon="close" v-close-popup>
              <q-tooltip>Close</q-tooltip>
            </q-btn>
          </q-bar>
          <q-card-section>
            <q-uploader 
              
              :factory="uploadFile"
              label="Files"
              multiple
              @uploading="closeUploader"
            >
              <template v-slot:list="scope">
                <q-list separator>
                  <q-item v-for="file in scope.files" :key="file.__key">
                    <q-item-section>
                      <q-item-label class="full-width">
                        {{ file.name }}
                      </q-item-label>

                      <q-item-label caption>
                        {{ file.status }}
                      </q-item-label>

                      <q-item-label caption>
                        {{ file.__sizeLabel }}
                      </q-item-label>
                    </q-item-section>

                    <q-item-section v-if="file.__img" thumbnail class="gt-xs">
                      <img :src="file.__img.src">
                    </q-item-section>

                    <q-item-section top side>
                      <q-btn class="gt-xs" size="12px" flat dense round icon="delete" @click="scope.removeFile(file)"/>
                    </q-item-section>
                  </q-item>

                </q-list>
              </template>
            </q-uploader>
          </q-card-section>
        </q-card>
      </q-dialog>
  <q-table
        class="my-sticky-header-table"
        title="Files"
        dense
        bordered
        flat
        :rows="files"
        :columns="columns"
        row-key="id"
        :loading="loading"
        :pagination="file_pagination"
        selection="single"
        :filter="filter"
      >
        <template v-slot:body-selection="props">
          <q-btn class="pointer" :size="directory_size" color="yellow" flat :icon="icons.folder" @click="openDirectory(props)">
            <q-tooltip>Open this folder</q-tooltip>
          </q-btn>
        </template>
        <template v-slot:top-left>
          <q-btn size="md" color="primary" class="q-ma-non q-pa-none pointer" flat :icon="icons.newFolder" @click="openCreateFolderDialog()">
            <q-tooltip>create folder</q-tooltip>
          </q-btn>
          <q-btn size="md" color="primary" class="q-ma-sm q-pa-none pointer" flat :icon="icons.upload" @click="openFileUpload()">
             <q-tooltip>upload file</q-tooltip>
          </q-btn>
          <!-- <q-btn size="sm" color="primary"  label="crate folder" @click="openCreateFolderDialog()"/> -->
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
      </q-table>
</div>
</template>

<script>

import DriveService from "../../../services/DriveService"
import { commonMixin } from "../../../mixin/common"
import { ref } from 'vue'
import {matArrowBackIosNew,matFolder, matCreateNewFolder, matFileUpload} from "@quasar/extras/material-icons";
export default {
  name: 'File list',
  mixins: [commonMixin],
  props: {
  },
  setup () {
    return {
      icons: {
        leftArrow: matArrowBackIosNew,
        folder: matFolder,
        newFolder: matCreateNewFolder,
        upload: matFileUpload
      },
      selected: ref([]),
      columns: [
        {
          name: "file_name",
          required: true,
          label: "Name",
          align: "left",
          field: row => row.file_name,
          format: val => `${val}`,
          sortable: true
        },
        {name: "file_type",  align: "left", label: "Category", field: "file_type", sortable: true},
        {name: "created_by",  align: "left", label: "Created By", field: "created_by", sortable: true},
        {name: "createdTimestamp",  align: "left", label: "Created", field: "createdTimestamp", sortable: true}
      ],
      
    }
  },
  watch: {
    system_path(val){
      this.getAllfiles()
    }
  },
  components: {
  },
  created() {},
  mounted() {
    this.directory_id = this.$route.params.directory_id
    this.getRootDirectory()
  },
  data() {
    return {
      clientId: this.getClientId(),
      admin: this.isAdmin(),
      user_name: this.getUser() !== null ? this.getUser().name : 'Admin',
      file_pagination: { rowsPerPage: 15 },
      filter: "",
      directory_id: this.$route.params.directory_id,
      directory: null,
      system_path: '',
      files: [],
      folder_name: '',
      open: false,
      openUpload: false,
      description:'',
      file_name:''
      
    };
  },
  methods: {
    getRootDirectory() {
      DriveService.getDirectory(this.clientId, this.directory_id)
        .then(response => {
           this.directory = response
           this.system_path = this.directory.name
        }).catch(err => {
          files = []
          this.fail(err.message)
        });
    },
    openCreateFolderDialog() {
      this.open = true;
      this.folder_name = ''
    },
    onHide() {
      this.open = false
    },
    createFolder(){
      let meta = {
        id: null,
        clientId: this.clientId,
        directory_id: this.directory_id,
        system_path: this.system_path,
        file_name: this.folder_name,
        file_type: 'Folder',
        file_path: null,
        created_by: this.user_name,
        description: 'Folder'
      }
      DriveService.createFolder(meta)
        .then(response => {
          console.log(response)
          this.open = false
          this.getAllfiles()
        }).catch(err => {
          files = []
          this.fail(err.message)
        });
    },
    openFileUpload(){
      this.openUpload = true
    },
    closeUploader(){
      window.alert('ok')
    },
    onHideUpload() {
      this.openUpload = false
    },
    getAllfiles(){
      let getFilesRequest ={
        client_id: this.clientId,
        directory_id: this.directory_id,
        system_path: this.system_path
      }
      DriveService.getAllFiles(getFilesRequest)
        .then(response => {
           this.files = response
        }).catch(err => {
          this.files = []
          this.fail(err.message)
        });
    },
    openDirectory(props){
      this.system_path = this.system_path + '/' + props.row.file_name
    },
    back() {
      if(this.system_path.includes('/')){
        const lastIndex = this.system_path.lastIndexOf('/')
        this.system_path = this.system_path.substring(0,lastIndex)
      } else {
        this.$router.push({ name: "drive"});
      }
    },
    uploadFile(files) {
      let meta = {
        id: null,
        clientId: this.clientId,
        directory_id: this.directory_id,
        system_path: this.system_path,
        file_name: files[0].name,
        file_type: 'File',
        file_path: null,
        created_by: this.user_name
      }
      files[0].status = 'uploading...'
      DriveService.uploadFile(files[0])
        .then(response => {
          files[0].status = 'done!'
          return files[0]
        }).catch(err => {
          this.fail(err.message)
        })

    }
  }
};
</script>
<style scoped>
.pointer {
  cursor: pointer;
}
</style>