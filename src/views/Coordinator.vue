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
      <NewOrphanRegistrationModel
        :newOrphanDialog="newOrphanDialog"
        :orphanVillageId="selectedOrphanVillage"
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
                  <v-switch
                    v-model="singleOrphanSelect"
                    :label="selectSwitch"
                    class="px-3 mt-0"
                  ></v-switch>
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

    <template v-if="showSupportPlanTable">
      <v-fab-transition>
        <support-plan-table />
      </v-fab-transition>
    </template>

    <template v-else>
      <v-row v-if="!showOrphans" justify="center" no-gutters>
        <!-- Table Card -->
        <!-- TODO: # add a details column -->
        <!--       # impliment editable fullName * NEW FEATURE * -->
        <!--       # impliment a custom pagination -->
        <v-col cols="11" style="margin-top: 6rem">
          <v-card elevation="3" min-height="50vh">
            <v-sheet class="overflow-y-auto" max-height="83vh">
              <v-data-table
                :headers="headers"
                :items="villages"
                item-key="id"
                :search="search"
                append-icon="mdi-magnify"
                :custom-filter="searchFilter"
                multi-sort
                class="elevation-1"
              >
                <template v-slot:top>
                  <v-row style="margin: 0px">
                    <!-- Filter/Search Selection -->
                    <!-- TODO: # add close icon and function to remove from selection -->
                    <!--       # add tooltip maybe -->
                    <v-col cols="12" sm="7" class="ml-md-auto mx-sm-auto">
                      <v-responsive
                        min-width="300"
                        max-width="300"
                        class="mx-xs-auto ml-sm-auto mt-sm-2"
                      >
                        <v-select
                          v-model="filterValue"
                          hint="select field/s to filter explicity"
                          :items="filterItems"
                          :menu-props="{ bottom: true, offsetY: true }"
                          solo
                          flat
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
                              @click:close="removeSelected(item)"
                              v-if="index === 0"
                            >
                              <span>{{ item }}</span>
                            </v-chip>
                            <span v-if="index === 1" class="grey--text caption">
                              (+{{ filterValue.length - 1 }} others)
                            </span>
                          </template>
                        </v-select>
                      </v-responsive>
                    </v-col>
                    <!-- Search Input -->
                    <!-- TODO: # add search icon and close icon -->
                    <v-col
                      cols="12"
                      sm="6"
                      md="5"
                      offset-md="0"
                      class="mx-sm-auto"
                    >
                      <v-responsive max-width="300" class="ml-sm-3 mt-sm-4">
                        <v-text-field
                          v-model="search"
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
                  </v-row>
                </template>
                <template v-slot:item.id="{ item }">
                  {{ getVillageTableId(item) }}
                </template>
                <template v-slot:item.villageName="{ item }">
                  {{ getVillageTableVillageName(item) }}
                </template>
                <template v-slot:item.district="{ item }">
                  {{ getVillageTableDistrict(item) }}
                </template>
                <template v-slot:item.registrationDate="{ item }">
                  {{ getVillageTableRegistrationDate(item) }}
                </template>
                <template v-slot:item.donor="{ item }">
                  {{ getVillageTableDonor(item) }}
                </template>
                <template v-slot:item.socialWorker="{ item }">
                  {{ getVillageTableSocialWorker(item) }}
                </template>
                <template v-slot:item.orphans="{ item }">
                  <v-btn
                    small
                    color="primary darken-2"
                    @click="goToOrphansTable(item)"
                    >Show Orphan</v-btn
                  >
                </template>
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
import NewOrphanRegistrationModel from "@/components/NewOrphanRegistrationModel.vue";
import SupportPlanTable from "../components/SupportPlanTable.vue";

export default {
  components: {
    OrphanList,
    AppNavBar,
    NewOrphanRegistrationModel,
    SupportPlanTable,
  },

  data() {
    return {
      search: "", // used for filter
      orphanSearch: "",
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
      headers: [
        { text: "Id", value: "id" },
        {
          text: "Village Name",
          align: "Start",
          value: "villageName",
        },
        {
          text: "District",
          value: "district",
        },
        {
          text: "Registred on",
          value: "registrationDate",
        },
        {
          text: "Donor",
          value: "donor",
        },
        {
          text: "Social Worker",
          value: "socialWorker",
        },
        {
          text: "Orphans",
          value: "orphans",
        },
      ],
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
      coordinatorUser: {
        firstName: "",
        middleName: "",
        lastName: "",
        email: "",
        role: "",
      },
      rules: {
        required: (value) => !!value || "Required.",
      },
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
      showOrphans: false,
      selectedOrphanIds: [],
    };
  },
  created() {
    this.initialize();
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
    showVillagesSelectionDialog(val) {
      if (val === true) {
        this.selectedOrphanVillageOptions = [...this.coordinator.villages];
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
  },
  methods: {
    initialize() {
      // console.log("routerCoordinatorId: ", this.$route.params.id);
      axios
        .post("/graphql/", {
          query: `query coordinator($id: ID!) {
                  coordinator(id: $id) {
                    firstName
                    middleName
                    lastName
                    user {
                      id
                      email
                      role
                    }
                    villages {
                      id
                      name
                      registrationDate
                      district {
                        name
                        socialWorkers {
                          firstName
                          middleName
                          lastName
                        }
                      }
                      donor {
                        nameInitials
                      }
                      orphans {
                        id
                        created_at
                        firstName
                        father {
                          firstName
                          lastName
                        }
                        dateOfBirth
                        gender
                        sponsorshipStatuses {
                          id
                          status
                          date
                        }
                      }
                    }
                  }
                }`,
          variables: {
            id: this.$route.params.id,
          },
        })
        .then((res) => res.data.data.coordinator)
        .then((coordinator) => {
          this.coordinator = Object.assign({}, coordinator);
          this.coordinatorUser = Object.assign(
            this.coordinatorUser,
            coordinator.user
          );
          this.villages.push(...this.coordinator.villages);
          this.orphans = this.coordinator.villages.reduce((acc, village) => {
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
    toggleNewOrphanDialog(val) {
      this.showVillagesSelectionDialog = val;
    },
    toggleSupportPlanTable(val) {
      this.showSupportPlanTable = val;
    },
    toggleChangeStatus(val) {
      this.showStatusChangeSelectionDialog = val;
    },
    getVillageTableId(item) {
      return item.id;
    },
    getVillageTableVillageName(item) {
      return item.name;
    },
    getVillageTableDistrict(item) {
      if (item.district === null) return "";
      return item.district.name;
    },
    getVillageTableRegistrationDate(item) {
      return item.registrationDate;
    },
    getVillageTableDonor(item) {
      if (item.donor === null) return "";
      return item.donor.nameInitials;
    },
    getVillageTableSocialWorker(item) {
      return (
        item.district.socialWorkers[0].firstName +
        " " +
        item.district.socialWorkers[0].middleName +
        " " +
        item.district.socialWorkers[0].lastName
      );
    },
    goToOrphansTable(item) {
      this.showOrphans = true;
      this.selectedOrphanIds = item.orphans.map((orphan) =>
        parseInt(orphan.id)
      );
    },
    // custom search function based on selected columns
    searchFilter(value, search, item) {
      // console.log(this.filterValue);
      if (search.length > 0) {
        if (this.filterValue.length > 0) {
          for (const filterVal of this.filterValue) {
            if (filterVal === this.headers[0].text) {
              return item.id.indexOf(search) !== -1;
            } else if (filterVal === this.headers[1].text) {
              return (
                item.name.toLowerCase().indexOf(search.toLowerCase()) !== -1
              );
            } else if (filterVal === this.headers[2].text) {
              return (
                item.district.name
                  .toLowerCase()
                  .indexOf(search.toLowerCase()) !== -1
              );
            } else if (filterVal === this.headers[3].text) {
              return (
                item.registrationDate
                  .toLowerCase()
                  .indexOf(search.toLowerCase()) !== -1
              );
              // TODO # fix it to be visible as stacked avatars
            } else if (filterVal === this.headers[4].text) {
              return (
                item.donor.nameInitials
                  .toLowerCase()
                  .indexOf(search.toLowerCase()) !== -1
              );
            } else if (filterVal === this.headers[5].text) {
              let socialWorkerName = `${item.district.socialWorkers[0].firstName} ${item.district.socialWorkers[0].middleName} ${item.district.socialWorkers[0].lastName}`;
              return (
                socialWorkerName.toLowerCase().indexOf(search.toLowerCase()) !==
                -1
              );
            } else if (filterVal === this.headers[6].text) {
              return parseInt(item.orphans.length) === parseInt(search);
            }
          }
        } else {
          return (
            item.name != null &&
            typeof item.name === "string" &&
            item.name
              .toString()
              .toLowerCase()
              .indexOf(search) !== -1
          );
        }
      }
    },
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
    async createSponsorshipStatus(orphanId, status) {
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
    removeSelected(item) {
      this.filterValue.splice(this.filterValue.indexOf(item), 1);
      this.filterValue = [...this.filterValue];
    },
  },
};
</script>
