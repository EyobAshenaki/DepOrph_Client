<template style="positon: relative;">
  <div>
    <AppNavBar
      :user="coordinatorUser"
      :dialog="showVillagesSelectionDialog"
      :newOrphanView="newOrphanDialog"
      :changeStatusDialogValue="showStatusChangeSelectionDialog"
      @toggleNewOrphanDialog="toggleNewOrphanDialog($event)"
      @toggleSupportPlanComponent="toggleSupportPlanTable($event)"
      @toggleChangeStatusDialog="toggleChangeStatus($event)"
    />
    <!-- village select Dialog -->
    <v-dialog v-model="showVillagesSelectionDialog" width="30%" persistent>
      <v-card>
        <v-card-title class="justify-center">
          Choose Village
        </v-card-title>
        <v-form ref="villageSelect" v-model="validVillageChoice">
          <v-responsive min-width="200" max-width="200" class="pl-0 mx-auto">
            <v-select
              v-model="selectedOrphanVillage"
              :items="selectedOrphanVillageOptions"
              item-text="name"
              item-value="id"
              :menu-props="{ bottom: true, offsetY: true }"
              solo
              outlined
              dense
              :rules="[rules.required]"
            >
            </v-select>
          </v-responsive>
        </v-form>
        <v-card-actions class="justify-end">
          <v-btn text class="red--text" @click="cancelVillagesChoice"
            >Cancel</v-btn
          >
          <v-btn
            text
            class="primary--text"
            @click="chooseVillages"
            :disabled="!validVillageChoice"
            >Confirm</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-fab-transition>
      <!-- <NewOrphanRegistrationModel
        :newOrphanDialog="newOrphanDialog"
        :orphanVillageId="selectedOrphanVillage"
        @dialogClosed="newOrphanDialog = $event"
        @registrationDone="addNewOrphan($event)"
      /> -->
      <orphan-registration-stepper 
        :newOrphanDialog="newOrphanDialog"
        :villageId="selectedOrphanVillage"
        @dialogClosed="newOrphanDialog = $event"
      />
    </v-fab-transition>
    <!-- StatusChange select Dialog -->
    <v-dialog v-model="showStatusChangeSelectionDialog" width="60%">
      <v-card>
        <v-card-title class="justify-center pb-5">
          Change Orphan Status Form Current To Desired Status
        </v-card-title>
        <v-card-text class="pb-0">
          <v-form ref="statusSelect" v-model="validStatusSelect">
            <v-row class="justify-center">
              <v-col cols="5" class="pb-0">
                <v-responsive
                  min-width="200"
                  max-width="200"
                  class="pl-0 mx-auto"
                >
                  <v-select
                    v-model="currentStatus"
                    :items="currentStatusOptions"
                    item-text="text"
                    item-value="value"
                    :menu-props="{ bottom: true, offsetY: true }"
                    solo
                    outlined
                    dense
                    label="Current Status"
                    persistent-hint
                    :rules="[rules.required]"
                  >
                  </v-select>
                </v-responsive>
              </v-col>
              <v-col cols="1" align="center" class="pt-5">
                <v-icon class="justify-center">
                  mdi-arrow-right-thick
                </v-icon>
              </v-col>
              <v-col cols="5" class="pb-0">
                <v-responsive
                  min-width="200"
                  max-width="200"
                  class="pl-0 mx-auto"
                >
                  <v-select
                    v-model="changedStatus"
                    :items="changedStatusOptions"
                    item-text="text"
                    item-value="value"
                    :menu-props="{ bottom: true, offsetY: true }"
                    solo
                    outlined
                    dense
                    label="Desired Status"
                    persistent-hint
                    :rules="[rules.required]"
                  >
                  </v-select>
                </v-responsive>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn text class="red--text" @click="cancelStatusChangeSelection"
            >Cancel</v-btn
          >
          <v-btn
            text
            class="primary--text"
            @click="confirmStatusChangeSelection"
            :disabled="!validStatusSelect"
            >Confirm</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- StatusChange Table Dialog -->
    <v-dialog v-model="changeStatusOrphanDialog">
      <v-card elevation="">
        <v-sheet class="overflow-y-auto" max-height="56vh">
          <v-data-table
            v-model="selectedOrphans"
            :headers="orphanHeaders"
            :items="orphans"
            item-key="id"
            :search="orphanSearch"
            append-icon="mdi-magnify"
            :custom-filter="orphanSearchFilter"
            :single-select="singleOrphanSelect"
            show-select
            multi-sort
            class="elevation-1"
          >
            <template v-slot:top>
              <v-row style="margin: 0px">
                <!-- Filter/Search Selection -->
                <!-- TODO: # add close icon and function to remove from selection -->
                <!--       # add tooltip maybe -->
                <v-col
                  sm="5"
                  offset="0"
                  offset-sm="0"
                  offset-md="0"
                  class="mt-4 mt-sm-0"
                >
                  <v-responsive
                    min-width="300"
                    max-width="300"
                    class="mx-xs-auto ml-sm-auto mt-sm-2"
                  >
                    <v-select
                      v-model="orphanFilterValue"
                      hint="select field/s to filter explicity"
                      :items="orphanFilterItems"
                      :menu-props="{ bottom: true, offsetY: true }"
                      solo
                      outlined
                      dense
                      persistent-hint
                      multiple
                      placeholder="Filter By"
                    >
                      <template v-slot:selection="{ item, index }">
                        <v-chip
                          color="primary"
                          dark
                          label
                          close
                          close-icon="mdi-close-outline"
                          @click:close="removeSelectedOrphanFilter(item)"
                          v-if="index === 0"
                        >
                          <span>{{ item }}</span>
                        </v-chip>
                        <span v-if="index === 1" class="grey--text caption">
                          (+{{ orphanFilterValue.length - 1 }}
                          others)
                        </span>
                      </template>
                    </v-select>
                  </v-responsive>
                </v-col>
                <!-- Search Input -->
                <!-- TODO: # add search icon and close icon -->
                <v-col
                  sm="7"
                  md="4"
                  offset="1"
                  offset-sm="3"
                  offset-md="1"
                  offset-lg="0"
                >
                  <v-responsive max-width="300" class="ml-sm-3 mt-sm-4">
                    <v-text-field
                      v-model="orphanSearch"
                      placeholder="Search"
                      dense
                      flat
                      clearable
                      append-icon="mdi-filter-minus"
                    >
                      <template v-slot:prepend> </template>
                    </v-text-field>
                  </v-responsive>
                </v-col>
                <!-- Select Switch -->
                <v-col cols="4" class="pa-0">
                  <v-switchnewOrphanDialog
                    v-model="singleOrphanSelect"
                    :label="selectSwitch"
                    class="px-3 mt-0"
                  ></v-switchnewOrphanDialog>
                </v-col>
                <!-- status change dialog -->
                <v-col class="mt-n4 pr-7" align="right">
                  <v-dialog
                    transition="dialog-bottom-transition"
                    persistent
                    max-width="450"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        color="primary"
                        v-bind="attrs"
                        v-on="on"
                        :disabled="selectedOrphans.length <= 0"
                        >Change Status</v-btn
                      >
                    </template>
                    <template v-slot:default="dialog">
                      <v-card max-width="">
                        <v-card-title class="">
                          <span class="mx-auto">
                            Are you sure?
                          </span>
                        </v-card-title>
                        <v-card-text class="text-center pb-0">
                          {{
                            `Enter the reason for selected orphans to change status from ${currentStatus} to ${changedStatus}`
                          }}
                          <v-responsive class="ml-sm-3 mt-sm-4">
                            <v-text-field
                              v-model="statusChangeReason"
                              placeholder="Status Change Reason"
                              dense
                              flat
                            >
                            </v-text-field>
                          </v-responsive>
                        </v-card-text>
                        <v-card-actions class="justify-center">
                          <v-btn
                            color="error"
                            text
                            @click="cancelStatusChange(dialog)"
                            >Cancel</v-btn
                          >
                          <v-btn
                            color="primary"
                            text
                            @click="confirmStatusChange(dialog)"
                            >Confirm</v-btn
                          >
                        </v-card-actions>
                      </v-card>
                    </template>
                  </v-dialog>
                </v-col>
              </v-row>
            </template>
            <template v-slot:item.fullName="{ item }">
              {{ fullName(item) }}
            </template>
            <template v-slot:item.age="{ item }">
              {{ calcAge(item) }}
            </template>
            <template v-slot:item.sponsorshipStatus="{ item }">
              {{ calcSponsorshipStatus(item) }}
            </template>
            <!-- TODO # fix this coz this is done not to change the header array of objects -->
            <!-- <template v-slot:header.sponsoredDate="{ header }">
              {{ changeSponsoredDateHeaderOfNew(header) }}
            </template> -->
            <template v-slot:item.sponsoredDate="{ item }">
              {{ calcSponsoredDate(item) }}
            </template>
            <!-- <template v-slot:item.details="{ item }">
              <orphan-detail :details="item" />
            </template> -->
          </v-data-table>
          <!-- becomes visble when full name is edited -->
          <!-- TODO: # Impliment a loding functionality -->
          <!--       # maybe server side validation also -->
          <v-snackbar v-model="snack" :timeout="3000" :color="snackColor">
            {{ snackText }}

            <template v-slot:action="{ attrs }">
              <v-btn v-bind="attrs" text @click="snack = false">
                Close
              </v-btn>
            </template>
          </v-snackbar>
        </v-sheet>
      </v-card>
    </v-dialog>

    <!-- <orphan-registration-stepper /> -->

    <template v-if="showSupportPlanTable">
      <v-fab-transition>
        <support-plan-table :projectId="selectedProjectId" @closeSupportPlanTable="showSupportPlanTable = $event"/>
      </v-fab-transition>
    </template>

    <template v-else>
      <v-row v-if="!showOrphans" justify="center" no-gutters>
        <!-- Project Creation dialog -->
        <v-row justify="center">
          <v-dialog v-model="createProjectDialog" persistent max-width="600px">
            <template v-slot:activator="{ on, attrs }">
              <v-col
                cols="12"
                class="text-center"
                dark
                
                style="margin-top: 6rem"
              >
                <v-btn fab dark color="indigo">
                  <v-icon dark v-bind="attrs"
                v-on="on">
                    mdi-plus
                  </v-icon>
                </v-btn>
              </v-col>
            </template>

            <v-card>
              <v-card-title>
                <span class="text-h5">Create Project</span>
              </v-card-title>
              <v-card-text>
                <v-form
                  ref="createProjectForm"
                  v-model="validCreateProject"
                  lazy-validation
                >
                  <v-row>
                    <!-- Project start date -->
                    <v-col cols="12" md="6" sm="4">
                      <v-menu
                        ref="projectStartDateMenu"
                        v-model="projectStartDateMenu"
                        :close-on-content-click="false"
                        transition="scale-transition"
                        offset-y
                        min-width="auto"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field
                            v-model="projectStartDate"
                            label="Start date"
                            prepend-icon="mdi-calendar"
                            readonly
                            :rules="[rules.required]"
                            v-bind="attrs"
                            v-on="on"
                          ></v-text-field>
                        </template>
                        <v-date-picker
                          v-model="projectStartDate"
                          :active-picker.sync="projectStartDateActivePicker"
                          :min="
                            new Date(
                              Date.now() -
                                new Date().getTimezoneOffset() * 60000
                            )
                              .toISOString()
                              .substr(0, 10)
                          "
                          max="2070-01-01"
                          @change="projectStartDateSave"
                        ></v-date-picker>
                      </v-menu>
                    </v-col>
                    <!-- Project Number -->
                    <v-col cols="12" md="6" sm="4">
                      <v-text-field
                        v-model="projectNumber"
                        label="Number*"
                        type="number"
                        :rules="[rules.required]"
                      ></v-text-field>
                    </v-col>
                    <!-- Project duration in years -->
                    <v-col cols="12" md="6" sm="4">
                      <v-text-field
                        v-model="projectDurationInYears"
                        label="Duration*"
                        type="number"
                        :rules="[rules.required]"
                        hint="duration of the project in years"
                      ></v-text-field>
                    </v-col>
                    <!-- Project maximum number of orphans -->
                    <v-col cols="12" md="6" sm="4">
                      <v-text-field
                        v-model="projectMaxBeneficiaries"
                        label="Maximum beneficiaries*"
                        type="number"
                        :rules="[rules.required]"
                      ></v-text-field>
                    </v-col>
                    <!-- Project total budget -->
                    <v-col cols="12" md="6" sm="4">
                      <v-text-field
                        v-model="projectTotalBudget"
                        label="Total budget*"
                        type="number"
                        :rules="[rules.required]"
                      ></v-text-field>
                    </v-col>
                    <!-- Project admin cost -->
                    <v-col cols="12" md="6" sm="4">
                      <v-text-field
                        v-model="projectAdministrativeCost"
                        label="Administrative cost*"
                        type="number"
                        :rules="[rules.required]"
                      ></v-text-field>
                    </v-col>
                    <!-- Project location/village -->
                    <v-col cols="12" md="6" sm="6">
                      <v-select
                        v-model="projectLocation"
                        :items="allVillages"
                        :item-text="villageText_Value"
                        :item-value="villageText_Value"
                        :menu-props="{
                          top: true,
                          offsetY: true,
                        }"
                        :rules="[rules.required]"
                        label="Locations*"
                      ></v-select>
                    </v-col>
                    <!-- Project proposal insertion -->
                    <v-col cols="12" md="6" sm="6">
                      <v-file-input
                        v-model="projectProposalFile"
                        accept=".pdf,.doc"
                        label="Project proposal"
                        :rules="[rules.required]"
                        @change="toggleProjectProposalInput($event)"
                      >
                        <template v-slot:append>
                          <v-tooltip top>
                            <template v-slot:activator="{ on, attrs }">
                              <v-icon
                                class="ml-auto"
                                v-bind="attrs"
                                v-on="on"
                                @click="toggleProjectProposalDialog"
                              >
                                mdi-file-eye-outline
                              </v-icon>
                            </template>
                            <span>Preview</span>
                          </v-tooltip>

                          <!-- preview image popup -->
                          <v-dialog v-model="projectProposalDialog">
                            <v-container>
                              <v-row>
                                <!-- <v-col>what</v-col> -->
                                <v-spacer></v-spacer>
                                <v-col class="mr-n12" sm="1">
                                  <v-icon
                                    dark
                                    @click="toggleProjectProposalDialog"
                                  >
                                    mdi-close
                                  </v-icon>
                                </v-col>
                              </v-row>

                              <v-img
                                height="82vh"
                                :src="projectProposalPreview"
                                contain
                                alt="Project Proposal Document"
                              ></v-img>
                            </v-container>
                          </v-dialog>
                        </template>
                      </v-file-input>
                    </v-col>
                  </v-row>
                </v-form>
                <small>*indicates required field</small>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="red darken-1"
                  text
                  @click="createProjectDialog = false"
                >
                  Close
                </v-btn>
                <v-btn
                  color="blue darken-1"
                  text
                  :disabled="!validCreateProject"
                  @click="createProjectSave"
                >
                  Save
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-row>
        <!-- Project Main card -->
        <v-col cols="12">
          <v-card
            class="mx-auto mt-8"
            min-width="500"
            max-width="90%"
            height="100%"
          >
            <v-card-text>
              <v-col class="mx-auto" cols="12" sm="6">
                <v-text-field
                  v-model="searchProject"
                  label="Search"
                  outlined
                  clearable
                ></v-text-field>
              </v-col>
              <!-- Project Card lists -->
              <v-row class="d-flex justify-space-around">
                <!-- <v-col class="" cols=""> -->
                <v-card
                  v-for="(item, idx) in projects"
                  :key="idx"
                  class="mb-8"
                  max-width="450"
                >
                  <v-img
                    height="200px"
                    src="../assets/brandi-redd-aJTiW00qqtI-unsplash.jpg"
                  >
                    <v-col cols="12" class="ma-0 mt-3 d-flex justify-end">
                      <v-btn class="mr-1">
                        <v-icon>mdi-text-box-multiple-outline</v-icon>
                      </v-btn>

                      <v-btn @click="openSupportPlanDialog(item)">
                        <v-icon>mdi-calendar-month</v-icon>
                        <!-- <v-icon>mdi-handshake-outline</v-icon> -->
                      </v-btn>
                    </v-col>
                    <v-col cols="12" class="d-flex mt-12">
                      <v-card-title
                        class="justify-start"
                        style="font-size: 2em"
                      >
                        {{ `Project-${item.number}` }}
                      </v-card-title>
                    </v-col>
                  </v-img>
                  <!-- Middle part of the card -->
                  <v-card-text
                    class="text--primary ml-0"
                    style="font-size: 1.3em"
                  >
                    <v-col cols="12">
                      <v-row>
                        <v-icon size="60" color="teal">mdi-calendar</v-icon>
                        <v-col cols="">
                          <v-card-subtitle class="pa-0">From:</v-card-subtitle>
                          <p>
                            {{
                              new Date(item.startDate)
                                .toDateString()
                                .slice(
                                  new Date(item.startDate)
                                    .toDateString()
                                    .indexOf(" ")
                                )
                            }}
                          </p>
                        </v-col>

                        <v-divider class="my-4 mr-8" vertical></v-divider>

                        <v-col cols="">
                          <v-card-subtitle class="pa-0">To:</v-card-subtitle>
                          <p>{{ new Date(item.endDate)
                                .toDateString()
                                .slice(
                                  new Date(item.endDate)
                                    .toDateString()
                                    .indexOf(" ")
                                ) }}</p>
                        </v-col>
                      </v-row>
                    </v-col>
                    <v-col cols="12">
                      <v-row>
                        <v-icon size="60" color="orange"
                          >mdi-currency-usd</v-icon
                        >
                        <v-card-subtitle style="font-size: 1em"
                          >Total Budget:</v-card-subtitle
                        >
                        <p class="mb-0 pa-4 pl-0">{{ item.grandTotalBudget }}</p>
                      </v-row>
                    </v-col>
                  </v-card-text>

                  <v-divider class="mx-6"></v-divider>

                  <!-- Footer Part of the card -->
                  <v-card-text>
                    <v-row class="ma-0">
                      <v-col class="text-center">
                        <v-icon size="40" color="orange"
                          >mdi-account-group</v-icon
                        >
                        <v-card-title
                          class="px-0 pt-2 pb-1 ml-2"
                          style="font-size: 1.2em"
                          >Beneficiaries</v-card-title
                        >
                        <p class="mb-0 pl-0">
                          {{ item.maximumNumberOfBeneficiaries }}
                        </p>
                      </v-col>

                      <v-divider class="my-4" vertical></v-divider>

                      <v-col class="text-center">
                        <v-icon size="40" color="orange"
                          >mdi-check-circle</v-icon
                        >
                        <v-card-title
                          class="ml-4 pt-2 pb-1"
                          style="font-size: 1.2em"
                          >Status</v-card-title
                        >
                        <p class="mb-0 pl-0 text-body-2">{{ item.status }}</p>
                      </v-col>

                      <v-divider class="my-4" vertical></v-divider>

                      <v-col class="text-center">
                        <v-icon size="40" color="orange">mdi-home-group</v-icon>
                        <v-card-title
                          class="ml-1 pt-2 pb-1"
                          style="font-size: 1.2em"
                          ># Villages</v-card-title
                        >
                        <p class="mb-0 pl-0">
                          {{ item.location ? item.location.length : 0 }}
                        </p>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
                <!-- </v-col> -->
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <v-fab-transition v-else>
        <OrphanList
          :orphanIds="selectedOrphanIds"
          @onBack="showOrphans = $event"
        />
      </v-fab-transition>
    </template>
  </div>
</template>

<style scoped></style>

<script>
import axios from "axios";
import OrphanList from "@/views/OrphanList.vue";
import AppNavBar from "@/components/AppNavBar";
// import NewOrphanRegistrationModel from "@/components/NewOrphanRegistrationModel.vue";
import SupportPlanTable from "../components/SupportPlanTable.vue";
import OrphanRegistrationStepper from "../components/OrphanRegistrationStepper.vue"

export default {
  components: {
    OrphanList,
    AppNavBar,
    // NewOrphanRegistrationModel,
    SupportPlanTable,
    OrphanRegistrationStepper
  },

  data: () => ({
    search: "", // used for filter
    orphanSearch: "",
    searchProject: "",
    singleOrphanSelect: false,
    selectedOrphans: [],
    selectSwitch: "Multiple Orphans",
    drawer: false, // constroles the sidebar
    // test fields *****************
    test: "",
    benched: 0,
    snack: false,
    snackColor: "",
    snackText: "",
    max25chars: (v) => v.length <= 25 || "Input too long!",
    // *****************************
    // used in filter selection items
    filterItems: [
      "Id",
      "Village Name",
      "District",
      "Registred on",
      "Donor",
      "Social Worker",
    ],
    orphanFilterItems: [],
    filterValue: [],
    orphanFilterValue: [],
    // used for filter selection
    // table headers if that wasn't clear enough LOL
    orphanHeaders: [
      { text: "Id", value: "id" },
      {
        text: "Full Name",
        align: "start",
        value: "fullName",
      },
      {
        text: "Age",
        value: "age",
      },
      {
        text: "Gender",
        value: "gender",
      },
      {
        text: "Sponsorship Status",
        value: "sponsorshipStatus",
      },
      { text: "Sponsored Date", value: "sponsoredDate" },
    ],
    coordinator: {},
    donors: [],
    coordinatorUser: {
      firstName: "",
      middleName: "",
      lastName: "",
      email: "",
      role: "",
    },
    projects: [],
    rules: {
      required: (value) => !!value || "Required.",
    },
    createProjectDialog: false,
    validCreateProject: false,
    projectStartDateActivePicker: null,
    projectStartDate: null,
    projectStartDateMenu: false,
    projectNumber: null,
    projectDurationInYears: null,
    projectMaxBeneficiaries: null,
    projectTotalBudget: null,
    projectAdministrativeCost: null,
    projectProposalDialog: false,
    projectLocation: null,
    projectProposalFile: null,
    projectProposalPreview: null,
    selectedProjectId: null,
    newOrphanDialog: false,
    showVillagesSelectionDialog: false,
    selectedOrphanVillage: "",
    selectedOrphanVillageOptions: [],
    validVillageChoice: false,
    showSupportPlanTable: false,
    showStatusChangeSelectionDialog: false,
    validStatusSelect: false,
    currentStatus: "",
    currentStatusOptions: [
      { text: "New", value: "new" },
      { text: "Active", value: "active" },
    ],
    changedStatus: "",
    changedStatusOptions: [
      { text: "Processing", value: "processing" },
      { text: "Graduated", value: "graduated" },
    ],
    changeStatusOrphanDialog: false,
    statusChangeReason: "",
    // table rows/items
    orphans: [],
    villages: [],
    allVillages: [],
    showOrphans: false,
    selectedOrphanIds: { ids: [] },
  }),
  created() {
    this.initialize();
    this.initializeProjects();
    this.initializeAllVillages();
  },
  computed: {
    // temporary filter for the notification panel
    items() {
      return Array.from({ length: this.length }, (k, v) => v + 1); // I don't know what this is doing exactly
    },
    length() {
      return 7000;
    },
    // used in new orphan dialog
  },
  watch: {
    async showVillagesSelectionDialog(val) {
      if (val === true) {
        this.selectedOrphanVillageOptions = [];

        const villages = await axios
          .post("/graphql", {
            query: `query getVillagesByCoordinatorId ($coordinatorId: ID!) {
                      getVillagesByCoordinatorId (coordinatorId: $coordinatorId) {
                        id
                        name
                      }
                    }`,
            variables: {
              coordinatorId: this.$route.params.id,
            },
          })
          .then((res) => res.data.data.getVillagesByCoordinatorId)
          .catch((err) => console.warn(err));

        this.selectedOrphanVillageOptions = [...villages];
      }
    },
    currentStatus(val) {
      if (val === "new")
        this.changedStatusOptions = this.changedStatusOptions.filter(
          (cur) => cur.value === "graduated"
        );
      else {
        const processingIndex = this.changedStatusOptions.findIndex((elmt) => {
          return elmt.value === "processing";
        });
        if (processingIndex === -1) {
          this.changedStatusOptions.unshift({
            text: "Processing",
            value: "processing",
          });
        }
      }
    },
    singleOrphanSelect() {
      this.selectSwitch =
        this.singleOrphanSelect === true ? "Single Orphan" : "Multiple Orphans";
    },
    projectStartDateMenu(val) {
      val && setTimeout(() => (this.projectStartDateActivePicker = "YEAR"));
    },
  },
  methods: {
    initialize() {
      console.log("routerCoordinatorId: ", typeof this.$route.params.id);
      axios
        .post("/graphql/", {
          query: `query coordinator($id: ID!) {
                  coordinator(id: $id) {
                    id
                    firstName
                    middleName
                    lastName
                    user {
                      id
                      email
                      role
                    }
                    donors {
                      id
                      nameInitials
                      orphans {
                        id
                      }
                    }
                  }
                }`,
          variables: {
            id: this.$route.params.id,
          },
        })
        // .then(res => console.log(res.data.data.coordinator))
        .then((res) => res.data.data.coordinator)
        .then((coordinator) => {
          this.coordinator = Object.assign({}, coordinator);
          this.coordinatorUser = Object.assign(
            this.coordinatorUser,
            coordinator.user
          );
          this.donors = [...this.coordinator.donors];

          // #          // change this with the getVillagebyCoordinatorId

          // this.villages.push(...this.coordinator.villages);

          // amended
          this.orphans = this.coordinator.donors.reduce((acc, village) => {
            return acc.concat(village.orphans);
          }, []);
          for (const property in this.coordinatorUser) {
            if (Object.hasOwnProperty.call(this.coordinator, property)) {
              this.coordinatorUser[property] = coordinator[property];
            }
          }
          // console.log("coordinator", this.coordinator);
        })
        .catch((err) => console.warn(err));
    },
    initializeProjects() {
      axios
        .post("/graphql/", {
          query: `query getProjectsByCoordinatorId ($coordinatorId: ID!) {
                  getProjectsByCoordinatorId(coordinatorId: $coordinatorId) {
                    id
                    number
                    startDate
                    endDate
                    status
                    maximumNumberOfBeneficiaries
                    durationInYears
                    grandTotalBudget
                    administrativeCost
                    supportPlans {
                      id
                      donor {
                        id
                        nameInitials
                      }
                    }
                    location {
                      id
                      name
                      orphans {
                        id
                        firstName
                        father {
                          firstName
                          lastName
                        }
                        dateOfBirth
                        gender
                        accountNumber
                      }
                    }
                  }
                }`,
          variables: {
            coordinatorId: this.$route.params.id,
          },
        })
        .then((res) => res.data.data.getProjectsByCoordinatorId)
        .then((projects) => (this.projects = [...projects]))
        .catch((err) => console.warn(err));
    },
    initializeAllVillages() {
      return axios
        .post("/graphql/", {
          query: `query {
                  allVillages {
                    id
                    name
                  }
                }`,
        })
        .then((res) => res.data.data.allVillages)
        .then((allVillages) => (this.allVillages = [...allVillages]))
        .catch((err) => console.warn(err));
    },
    toggleNewOrphanDialog(val) {
      this.showVillagesSelectionDialog = val;
    },
    toggleSupportPlanTable(val) {
      console.log(val)
      // this.showSupportPlanTable = val;
    },
    toggleChangeStatus(val) {
      this.showStatusChangeSelectionDialog = val;
    },
    toggleProjectProposalInput() {
      if (this.projectProposalFile) {
        this.projectProposalPreview = URL.createObjectURL(
          this.projectProposalFile
        );
        console.log("Preview", this.projectProposalPreview);
      }
    },
    toggleProjectProposalDialog() {
      this.projectProposalDialog = !this.projectProposalDialog;
    },
    // #
    goToOrphansTable() {
      this.showOrphans = true;
      this.selectedOrphanIds.ids = this.orphans.map((orphan) =>
        parseInt(orphan.id)
      );
    },
    addNewOrphan(newOrphanId) {
      console.log(`adding new orhan`, newOrphanId);
      this.selectedOrphanIds.ids.push(parseInt(newOrphanId));
    },
    // custom search function based on selected columns
    orphanSearchFilter(value, search, item) {
      if (search.length > 0) {
        if (this.orphanFilterValue.length > 0) {
          for (const filterVal of this.orphanFilterValue) {
            if (filterVal === this.headers[0].text) {
              return item.id.indexOf(search) !== -1;
            } else if (filterVal === this.headers[1].text) {
              return (
                this.fullName(item)
                  .toLowerCase()
                  .indexOf(search.toLowerCase()) !== -1
              );
            } else if (filterVal === this.headers[2].text) {
              return (
                this.calcAge(item)
                  .toString()
                  .indexOf(search) !== -1
              );
            } else if (filterVal === this.headers[3].text) {
              return (
                item.gender.toLowerCase().indexOf(search.toLowerCase()) !== -1
              );
            } else if (filterVal === this.headers[4].text) {
              return (
                this.calcSponsorshipStatus(item)
                  .toLowerCase()
                  .indexOf(search.toLowerCase()) !== -1
              );
            } else if (filterVal === this.headers[5].text) {
              return this.calcSponsoredDate(item).indexOf(search) !== -1;
            } else {
              return -1;
            }
          }
        } else {
          return (
            this.fullName(item) != null &&
            typeof this.fullName(item) === "string" &&
            this.fullName(item)
              .toString()
              .toLowerCase()
              .indexOf(search) !== -1
          );
        }
      }
    },
    fullName(item) {
      return (
        `${item.firstName.substr(0, 1).toUpperCase()}${item.firstName.substr(
          1
        )}` +
        ` ${item.father.firstName
          .substr(0, 1)
          .toUpperCase()}${item.father.firstName.substr(1)}` +
        ` ${item.father.lastName
          .substr(0, 1)
          .toUpperCase()}${item.father.lastName.substr(1)}`
      );
    },
    calcAge(item) {
      return (
        new Date().getUTCFullYear() -
        new Date(Date.parse(item.dateOfBirth.toString())).getUTCFullYear()
      );
    },
    calcSponsorshipStatus(item) {
      return item.sponsorshipStatuses[item.sponsorshipStatuses.length - 1]
        .status;
    },
    calcSponsoredDate(item) {
      const options = {
        // weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      };
      return new Date(
        Date.parse(
          item.sponsorshipStatuses[
            item.sponsorshipStatuses.length - 1
          ].date.toString()
        )
      ).toLocaleDateString(undefined, options);
    },
    chooseVillages() {
      if (this.$refs.villageSelect.validate()) {
        this.villageChoiceClose();
        // don't reset here. coz selectedOrphanVillage is passed as a prop to other components
        // this.villageChoiceReset();
        this.selectedOrphanVillageOptions = [];
        this.newOrphanDialog = true;
      } else {
        // handle error and show some kind of notification
      }
    },
    cancelVillagesChoice() {
      this.selectedOrphanVillage = "";
      this.villageChoiceClose();
      this.villageChoiceReset();
    },
    villageChoiceClose() {
      this.showVillagesSelectionDialog = false;
    },
    villageChoiceReset() {
      this.$refs.villageSelect.reset();
    },

    confirmStatusChangeSelection() {
      if (this.$refs.statusSelect.validate()) {
        this.orphans = this.orphans.filter((orphan) => {
          const statuses = orphan.sponsorshipStatuses;
          return statuses[statuses.length - 1].status === this.currentStatus;
        });
        this.statusChangeSelectionClose();
        this.changeStatusOrphanDialog = true;
      } else {
        // handle error and show some kind of notification
      }
    },
    cancelStatusChangeSelection() {
      this.statusChangeSelectionClose();
      this.statusChangeSelectionReset();
    },
    statusChangeSelectionClose() {
      this.showStatusChangeSelectionDialog = false;
    },
    statusChangeSelectionReset() {
      this.$refs.statusSelect.reset();
    },
    removeSelectedOrphanFilter(item) {
      this.orphanFilterValue.splice(this.orphanFilterValue.indexOf(item), 1);
      this.orphanFilterValue = [...this.orphanFilterValue];
    },
    cancelStatusChange(dialog) {
      dialog.value = false;
    },
    confirmStatusChange(dialog) {
      for (const orphan of this.selectedOrphans) {
        const orphanId = orphan.id;
        this.createSponsorshipStatus(orphanId, this.changedStatus)
          .then((sponsorshipStatuse) => {
            console.log("SponsoreStatus:", sponsorshipStatuse);
          })
          .catch((err) => console.warn(err));
      }
      dialog.value = false;
    },
    createSponsorshipStatus(orphanId, status) {
      return axios
        .post("/graphql", {
          query: `mutation createSponsorshipStatus(
                  $status: sponsorshipStatus
                  $date: DateTime!
                  $reason: String
                  $orphanId: ID
                ) {
                  createSponsorshipStatus(status: $status, date: $date, reason: $reason, orphanId: $orphanId) {
                    id
                    status
                    reason
                    date
                    orphan {
                      id
                      firstName
                      father {
                        firstName
                        lastName
                      }
                      dateOfBirth
                      gender
                      accountNumber
                    }
                  }
                }`,
          variables: {
            status: status,
            date: new Date().toISOString(),
            reason: this.statusChangeReason,
            orphanId: orphanId,
          },
        })
        .then((res) => res.data.data.createSponsorshipStatus)
        .catch((err) => console.warn(err));
    },
    
    createProject(
      number,
      startDate,
      endDate,
      maximumNumberOfBeneficiaries,
      durationInYears,
      location,
      grandTotalBudget,
      administrativeCost,
      coordinators
    ) {
      return axios
        .post("/graphql/", {
          query: `mutation createProject (
                  $number: String!
                  $startDate: DateTime
                  $endDate: DateTime
                  $maximumNumberOfBeneficiaries: Int!
                  $durationInYears: Int!
                  $location: [ID]!
                  $grandTotalBudget: Float!
                  $administrativeCost: Float!
                  $coordinators: [ID]
                ) {
                  createProject (
                    number: $number
                    startDate: $startDate
                    endDate: $endDate
                    maximumNumberOfBeneficiaries: $maximumNumberOfBeneficiaries
                    durationInYears: $durationInYears
                    location: $location
                    grandTotalBudget: $grandTotalBudget
                    administrativeCost: $administrativeCost
                    coordinators: $coordinators
                  ) {
                    id
                  }
                }`,
          variables: {
            number: number,
            startDate: startDate,
            endDate: endDate,
            maximumNumberOfBeneficiaries: maximumNumberOfBeneficiaries,
            durationInYears: durationInYears,
            location: location,
            grandTotalBudget: grandTotalBudget,
            administrativeCost: administrativeCost,
            coordinators: coordinators,
          },
        })
        .then((res) => res.data.data.createProject)
        .catch((err) => console.warn(err));
    },

    openSupportPlanDialog(project) {
      this.selectedProjectId = project.id;

      this.showSupportPlanTable = true;
    },
    async createProjectDocuments(documentUrl, documentType, projectId) {
      return axios
        .post("/graphql/", {
          query: `mutation createProjectDocument (
                  $documentUrl: String!
                  $documentType: projectDocumentType!
                  $projectId: ID!
                ) {
                  createProjectDocument (
                    documentUrl: $documentUrl
                    documentType: $documentType
                    projectId: $projectId
                  ) {
                    id
                    documentType
                  }
                }`,
          variables: {
            documentUrl: documentUrl,
            documentType: documentType,
            projectId: projectId,
          },
        })
        .then((res) => res.data.data.createProjectDocuments)
        .catch((err) => console.warn(err));
    },
    async createProjectSave() {
      if (this.$refs.createProjectForm.validate()) {
        const startDate = new Date(this.projectStartDate).toISOString();

        let tempDate = new Date(startDate);
        const endDate = new Date(
          tempDate.setFullYear(
            tempDate.getFullYear() + parseInt(this.projectDurationInYears)
          )
        ).toISOString();

        // check if the entered number is dublicate by using allProjects
        // even better make it auto increment automatically
        // projectNumber

        const locations = this.allVillages
          .filter((village) => {
            return village.name === this.projectLocation;
          })
          .map((village) => village.id);

        const coordinators = [this.coordinator.id];
        const projectProposalUrl = "qwertyuiop";

        // const projectProposalFormData = new FormData();
        // projectProposalFormData.append(
        //   "ProjectProposal",
        //   this.projectProposalFile,
        //   this.projectProposalFile.name
        // );

        // const projectProposalUrl = await axios
        //   .post(
        //     `/public/images/orphanProjectProposal/`,
        //     projectProposalFormData
        //   )
        //   .then((res) => res.data)
        //   .catch((err) => console.warn(err));

        const project = await this.createProject(
          this.projectNumber,
          startDate,
          endDate,
          parseInt(this.projectMaxBeneficiaries),
          parseInt(this.projectDurationInYears),
          locations,
          parseFloat(this.projectTotalBudget),
          parseFloat(this.projectAdministrativeCost),
          coordinators
        );

        const projectDocument = await this.createProjectDocuments(
          projectProposalUrl,
          "proposal",
          project.id
        );

        this.projects.push(project);

        console.log(projectDocument);

        this.$refs.createProjectForm.reset();
        this.createProjectDialog = false;
      }
    },

    cancelSupportPlan() {
      this.$refs.supportPlanForm.reset();
    },

    projectStartDateSave(date) {
      this.$refs.projectStartDateMenu.save(date);
    },

    donorText_Value(item) {
      return item.nameInitials;
    },
    villageText_Value(item) {
      return item.name;
    },

    // -------------------------------------
    sendTest() {
      console.log(this.villages);
    },

    // used for the specific edit on orphan name and sponsoreship status
    save() {
      // send the edited data to the server after validation via the rule/s prop
      // maybe impliment a loding functionality
      this.snack = true;
      this.snackColor = "success";
      this.snackText = "Data saved";
    },
    cancel() {
      // nothing happens keep the current changes
      this.snack = true;
      this.snackColor = "error";
      this.snackText = "Canceled";
    },
    open() {
      // maybe fireup validation functions
      this.snack = true;
      this.snackColor = "info";
      this.snackText = "Dialog opened";
    },
    close() {
      // this comes at the very last of the process so:
      // notify the user weither the operation was successful or keep/write to the log functionality
      console.log("Dialog closed");
    },
  },
};
</script>
