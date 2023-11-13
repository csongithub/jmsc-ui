<template>
<div>
  <div class="row bg-greay text-bold">
    <span class="text-subtitle2 text-blue" style="cursor:pointer">Drive://{{system_path}}</span> <q-space/>
    <q-btn size="sm" class="text-capitalize" flat color="primary" :icon="icons.leftArrow" label="Back" @click="back()">
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
            {{ 'Create Folder' }}
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
          <q-bar class="bg-primary glossy text-white text-weight-light text-subtitle2">
            {{ 'Upload Files' }}
            <q-space />
            <q-btn dense flat icon="close" v-close-popup>
              <q-tooltip>Close</q-tooltip>
            </q-btn>
          </q-bar>
          <q-card-section>
            <q-uploader style="width: 300px;"
              flat
              bordered
              multiple
              :hide-upload-btn="true"
              max-file-size="1073741824"
              @added="fileSelected"
              @rejected="fileRejected"
            >
              <template v-slot:header="scope">
                <div class="row no-wrap items-center q-pa-sm q-gutter-xs">
                  <q-btn v-if="selectedFiles.length > 0" icon="clear_all" @click="removeAllFiles(scope)" round dense flat >
                    <q-tooltip>Clear All</q-tooltip>
                  </q-btn>
                  <div class="col">
                    <!-- <div class="q-uploader__title">Files</div> -->
                    <!-- <div class="q-uploader__subtitle">{{ scope.uploadSizeLabel }}</div> -->
                  </div>
                  <q-btn v-if="scope.canAddFiles" icon="add_box"  round dense flat>
                    <q-uploader-add-trigger />
                    <q-tooltip>Select Files</q-tooltip>
                  </q-btn>
                  <q-btn v-if="selectedFiles.length > 0" icon="cloud_upload" @click="uploadFile()" round dense flat >
                    <q-tooltip>Upload Files</q-tooltip>
                  </q-btn>
                </div>
              </template>
              <template v-slot:list="scope">
                <q-list separator>
                  <q-item v-for="(file,index) in selectedFiles" :key="index">
                    <q-item-section>
                      <q-item-label class="full-width">
                        {{ file.name }}
                        <q-input borderless 
                          dense
                          outlined
                          debounce="300"
                          v-model="file.description"
                          placeholder="File Desciption"/>
                      </q-item-label>
                      <q-item-label caption>
                        {{ file.size }}
                      </q-item-label>
                      <q-item-label>
                        <span v-if="file.status !== 'Selected'" :style="{color: file.status==='Done!' ? 'green': 'blue'}">{{ file.status }}</span>
                        <q-btn v-if="file.status === 'Selected'" class="gt-xs text-capitalize" color="red" label="Remove" size="sm" flat dense @click="removeFile(index, scope)"/>
                        <q-icon v-if="file.status==='Done!'" name="check_circle" size="xs" color="green"/>
                        <q-icon v-if="file.status==='Uploading...'" name="file_upload" size="xs" color="blue"/>
                      </q-item-label>
                    </q-item-section>
                    <!-- <q-item-section v-if="file.__img" thumbnail class="gt-xs">
                      <img :src="file.__img.src">
                    </q-item-section> -->
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
          <q-btn class="pointer" :size="directory_size" :color="getColor(props.row)" flat :icon="getIcon(props.row)" @click="openDirectory(props.row)">
            <q-tooltip v-if="props.row.file_type === 'DIRECTORY'">Open this folder</q-tooltip>
            <q-tooltip v-else>View this file</q-tooltip>
          </q-btn>
        </template>
        <template v-slot:body-cell-actions="props">
          <q-btn class="text-capitalize" color="green" flat dense size="sm" :icon="icons.download" @click="download(props.row, false)">
              <q-tooltip>Download this file</q-tooltip>
            </q-btn>
           <q-btn class="text-capitalize" color="red" flat dense size="sm" :icon="icons.delete" @click="confirmDelete(props.row)">
              <q-tooltip>Move to trash</q-tooltip>
            </q-btn>
        </template>
        <template v-slot:top-left v-if="system_path">
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
  <!-- <q-btn  class="text-capitalize justify-center" color="primary" label="Download POC" @click="downloadPOC()"/> -->
      <q-dialog
        v-model="viewImage"
        persistent
        @hide="closeImageView"
        ref="viewImageRef"
      >
        <q-card style="width: 600px;">
          <q-bar class="bg-primary glossy text-white text-weight-light text-subtitle2">
            {{ '' }}
            <q-space />
            <q-btn class="text-capitalize text-grey" dense flat label="Download this image" @click="downloadImage()"/>
            <q-btn dense flat icon="close" v-close-popup>
              <q-tooltip>Close</q-tooltip>
            </q-btn>
          </q-bar>
          <q-card-section>
              <!-- <q-img :src="fileUrl" ></q-img> -->
              <img :src="fileUrl" class="responsive">
          </q-card-section>
        </q-card>
      </q-dialog>
      <q-dialog
        v-model="viewPdf"
        persistent
        @hide="closePdfView"
        ref="viewImageRef"
        :maximized="$q.screen.lt.md"
      >
        <q-card class="no-scroll" style="background: primary; min-width: 80vw; min-height: 80vh; width: 100%; height: 100%;">
          <q-bar class="bg-primary glossy text-white text-weight-light text-subtitle2">
            {{ 'Viewing Document' }}
            <q-space />
            <q-btn dense flat icon="close" v-close-popup>
              <q-tooltip>Close</q-tooltip>
            </q-btn>
          </q-bar>
          <div v-if="fileUrl !== null" class="q-pa-md q-gutter-sm" style="height: 600px;">
            <q-pdfviewer type="pdfjs" :src="fileUrl"/>
          </div>
        </q-card>
      </q-dialog>
</div>
</template>

<script>

import DriveService from "../../../services/DriveService"
import { commonMixin } from "../../../mixin/common"
import { ref } from 'vue'
import { downloadAPI } from "src/boot/axios";
import {
  matArrowBackIosNew,matFolder,
  matCreateNewFolder,
  matFileUpload,
  matImage,
  matFolderZip,
  matPictureAsPdf,
  matFileCopy,
  matDelete,
  matDownload
} from "@quasar/extras/material-icons";
// const FileDownload = require('js-file-download');
export default {
  name: 'File list',
  mixins: [commonMixin],
  props: {
  },
  setup () {
    return {
      icons: {
        leftArrow: matArrowBackIosNew,
        newFolder: matCreateNewFolder,
        upload: matFileUpload,
        directory: matFolder,
        image: matImage,
        zip: matFolderZip,
        pdf: matPictureAsPdf,
        other: matFileCopy,
        delete: matDelete,
        download: matDownload

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
        {name: "description",  align: "left", label: "Description", field: "description", sortable: false},
        {name: "file_type",  align: "left", label: "Category", field: "file_type", sortable: true},
        {name: "created_by",  align: "left", label: "Uploaded By", field: "created_by", sortable: true},
        {name: "createdTimestamp",  align: "left", label: "Upload Date", field: "createdTimestamp", sortable: true},
        // {name: "updated_by",  align: "left", label: "Modified By", field: "updated_by", sortable: true},
        // {name: "updatedTimestamp",  align: "left", label: "Modify Date", field: "updatedTimestamp", sortable: true},
         {name: "actions",  align: "left", label: "Actions", field: "actions", sortable: false}
      ],
      
    }
  },
  watch: {
    system_path(val) {
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
      user_name: this.getUser() !== null ? this.getUser().logonId : 'Admin',
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
      selectedFiles: [],
      fileUrl: null,
      viewImage: false,
      viewing_file_name:null,
      viewPdf: false
      
    };
  },
  methods: {
    // downloadPOC() {
    //   console.log('Download Axios Client: ' + JSON.stringify(this.$downloadAPI))
    //   return downloadAPI.get( '/v1/file/download/doc.jpg', {
    //     headers: {},
    //     responseType: 'arraybuffer'
    //   }).then(response => {
    //     let fileUrl = window.URL.createObjectURL(new Blob([response.data]))
    //     let fileLink = document.createElement('a');
    //     fileLink.href = fileUrl;
    //     fileLink.setAttribute('download', 'import-excel-template.jpg');
    //     document.body.appendChild(fileLink)
    //     fileLink.click(); 
    //     }).catch(err => {
    //         console.log("Error in getting records: " + JSON.stringify(err));
    //         return Promise.reject(err);
    //     });
    // },
    download(row, viewOnly){
      console.log('Download Axios Client: ' + JSON.stringify(this.$downloadAPI))
      return downloadAPI.get( '/v1/file/download/' + row.clientId + '/' + row.directory_id + '/' + row.id, {
        headers: {},
        responseType: 'arraybuffer'
      }).then(response => {
        let fileUrl = window.URL.createObjectURL(new Blob([response.data]))
        if(viewOnly){
          this.fileUrl = fileUrl
          this.viewing_file_name = row.file_name
          if(row.file_type === 'IMAGE') {
             this.viewImage = true
          } else if(row.file_type === 'PDF') {
             this.viewPdf = true
          }
          return
        }
        let fileLink = document.createElement('a');
        fileLink.href = fileUrl;
        fileLink.setAttribute('download', row.file_name);
        document.body.appendChild(fileLink)
        fileLink.click(); 
        }).catch(err => {
            console.log("Error in getting records: " + JSON.stringify(err));
            return Promise.reject(err);
        });
    },
    downloadImage(){
        let fileLink = document.createElement('a');
        fileLink.href = this.fileUrl;
        fileLink.setAttribute('download', this.viewing_file_name);
        document.body.appendChild(fileLink)
        fileLink.click(); 
    },
    confirmDelete(row){
      this.$q.dialog({
        title: 'The File will be deleted permanentlly, Are You Sure?',
        message: '',
        cancel: true,
        persistent: true
      }).onOk(() => {
        DriveService.deleteFile(row.clientId, row.directory_id, row.id)
        .then(response => {
           this.success('File deleted: ' + row.file_name)
           this.getAllfiles()
        }).catch(err => {
          this.fail(this.getErrorMessage(err))
        });
      }).onOk(() => {
      }).onCancel(() => {
        
      }).onDismiss(() => {
        
      })
    },
    getIcon(row){
      if(row.file_type === 'DIRECTORY')
        return this.icons.directory
      else if(row.file_type === 'IMAGE')
        return this.icons.image
      else if(row.file_type === 'PDF')
        return this.icons.pdf
      else if(row.file_type === 'ZIP')
        return this.icons.zip
      else if(row.file_type === 'OTHER')
        return this.icons.other
     
    },
    getColor(row) {
      if(row.file_type === 'DIRECTORY')
        return 'yellow-14'
      else if(row.file_type === 'IMAGE')
        return 'light-green-9'
      else if(row.file_type === 'PDF')
        return 'red'
      else if(row.file_type === 'ZIP')
        return 'yellow-14'
      // else if(row.file_type === 'OTHER')
      //   return this.icons.other
     
    },
    getRootDirectory() {
      if(this.isNullOrUndefined(this.directory_id)){
         this.back()
         return
      }
       
      DriveService.getDirectory(this.clientId, this.directory_id)
        .then(response => {
           this.directory = response
           this.system_path = this.directory.name
        }).catch(err => {
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
        file_type: 'DIRECTORY',
        file_path: null,
        created_by: this.user_name,
        updated_by: this.user_name,
        status: 'PRESENT',
        description: 'Folder'
      }
      DriveService.createFolder(meta)
        .then(response => {
          console.log(response)
          this.open = false
          this.getAllfiles()
        }).catch(err => {
          this.fail(err.message)
        });
    },
    openFileUpload(){
      this.openUpload = true
    },
    onHideUpload() {
      this.openUpload = false
      this.selectedFiles = []
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
    openDirectory(file){
      if(file.file_type === 'DIRECTORY')
        this.system_path = this.system_path + '/' + file.file_name
      else {
        let view_only = true
        this.download(file, view_only)
      }
    },
    closeImageView(){
      this.viewImage = false
      this.fileUrl = null
    },
    closePdfView(){
      this.pdfView = false
      this.fileUrl = null
    },
    back() {
      if(this.system_path.includes('/')){
        const lastIndex = this.system_path.lastIndexOf('/')
        this.system_path = this.system_path.substring(0,lastIndex)
      } else {
        this.$router.push({ name: "drive"});
      }
    },
    fileSelected(selectedFile){
      let file = {
        file :selectedFile[0],
        name: selectedFile[0].name,
        status: 'Selected',
        img: selectedFile[0].__img,
        key: selectedFile[0].__key,
        size:selectedFile[0].__sizeLabel
      }
      this.selectedFiles.push(file)
    },
    fileRejected(file){
      if(file[0].failedPropValidation === 'duplicate')
        this.warn('File already selected (duplicate file)')
      else if(file[0].failedPropValidation === 'max-file-size')
        this.fail('File size exceeded limit: 1gb')
    },
    removeFile(index, scope) {
      this.selectedFiles.splice(index,1)
    },
    removeAllFiles (scope){
      scope.files = []
      this.selectedFiles = []
    },
    uploadFile() {
      
      for(let selectedFile of this.selectedFiles) {
        if(selectedFile.status === 'Done!')
          continue
        let fileMetaData = {
          id: null,
          clientId: this.clientId,
          directory_id: this.directory_id,
          system_path: this.system_path,
          file_name: selectedFile.name,
          file_type: this.getFileType(selectedFile),
          file_path: null,
          created_by: this.user_name,
          updated_by: this.user_name,
          description: 'File',
          file_size: selectedFile.size,
          description: selectedFile.description,
          status: 'PRESENT'
        }
        selectedFile.status = 'Uploading...'
         DriveService.uploadFile(selectedFile.file, fileMetaData)
        .then(response => {
          selectedFile.status = 'Done!'
          console.log(response)
          this.getAllfiles()
        }).catch(err => {
          selectedFile.status = 'Upload Failed'
          this.fail(err.message)
        })
      }
    },
    getFileType(file){
        if(file.img !== undefined)
          return 'IMAGE'
        else if (file.img === undefined) {
          if(file.name.endsWith('.pdf'))
            return 'PDF'
          else if(file.name.endsWith('.zip'))
            return 'ZIP'
          else
            return 'OTHER' 
        }
      }
  }
};
</script>
<style scoped>
.pointer {
  cursor: pointer;
}

.material-symbols-outlined {
  font-variation-settings:
  'FILL' 0,
  'wght' 400,
  'GRAD' 0,
  'opsz' 24
}

</style>