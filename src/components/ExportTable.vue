<template>
  <div>
    <q-dialog
      v-model="openView"
      persistent
      ref="selectColumnRef"
      @hide="reset()"
    >
      <q-card style="width: 300px">
        <q-bar
          class="bg-primary glossy text-white text-weight-light text-subtitle2"
        >
          {{ header }}
          <q-space />
          <q-btn dense flat icon="close" v-close-popup>
            <q-tooltip>Close</q-tooltip>
          </q-btn>
        </q-bar>
        <q-card-section class="q-mt-lg">
          <q-table
            class=""
            title="Select Columns"
            dense
            bordered
            flat
            :rows="rows"
            :columns="columns"
            row-key="name"
            :pagination="{ rowsPerPage: rows.length }"
            selection="multiple"
            v-model:selected="selectedColumns"
            hide-bottom
          >
            <template v-slot:top-right>
              <q-btn
                v-if="selectedColumns.length > 0"
                dense
                flat
                color="primary"
                icon-right="archive"
                no-caps
                @click="exportFile()"
              >
                <q-tooltip>Export</q-tooltip>
              </q-btn>
            </template>
          </q-table>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { commonMixin } from "../mixin/common";

export default {
  name: "ExportTable",
  mixins: [commonMixin],
  watch: {
    open(val) {
      this.openView = val;
    },
  },
  props: {
    header: {
      type: Text,
      required: true,
      default: null,
    },
    open: {
      type: Boolean,
      required: true,
      default: false,
    },
    rows: {
      type: Array,
      required: true,
      default: null,
    },
    content: {
      type: Array,
      required: true,
      default: null,
    },
    fileName: {
      type: Text,
      required: true,
      default: null,
    },
    fileType: {
      type: Text,
      required: true,
      default: null,
    },
  },
  setup() {
    return {
      columns: [
        {
          name: "label",
          field: "label",
          label: "Name",
        },
      ],
    };
  },

  created() {},
  mounted() {},
  data() {
    return {
      openView: false,
      selectedColumns: [],
    };
  },
  methods: {
    reset() {
      this.selectedColumns = [];
      this.$emit("close");
    },
    exportFile() {
      this.exportTable(
        this.selectedColumns,
        this.content,
        this.fileName,
        this.fileType
      );
    },
  },
};
</script>
