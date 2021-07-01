<template style="positon: relative;">
  <div>
    <AppNavBar
      :user="coordinatorUser"
      :dialog="showVillagesSelectionDialog"
      @toggleNewOrphanDialog="toggleNewOrphanDialog($event)"
      @toggleSupportPlanComponent="toggleSupportPlanTable($event)"
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
        :orphanVillageId="parseInt(selectedOrphanVillage)"
        @dialogClosed="newOrphanDialog = $event"
      />
    </v-fab-transition>

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
        <v-col cols="9" style="margin-top: 6rem">
          <v-card elevation="3" min-height="50vh" max-width="150vh">
            <v-sheet
              id="scrolling-techniques-3"
              class="overflow-y-auto"
              max-height="83vh"
            >
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
import SupportPlanTable from '../components/SupportPlanTable.vue';

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
      filterValue: [],
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
      // table rows/items
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
  },
  methods: {
    initialize() {
      console.log("routerCoordinatorId: ", this.$route.params.id);
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
          for (const property in this.coordinatorUser) {
            if (Object.hasOwnProperty.call(this.coordinator, property)) {
              this.coordinatorUser[property] = coordinator[property];
            }
          }
          console.log("coordinator", this.coordinator);
          console.log("coordiantorUser", this.coordinatorUser);
        })
        .catch((err) => console.warn(err));
    },
    toggleNewOrphanDialog(val) {
      this.showVillagesSelectionDialog = val;
    },
    toggleSupportPlanTable(val) {
      console.log(val);
      this.showSupportPlanTable = val;
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
      console.log(item);
      console.log(this.selectedOrphanIds);
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
    chooseVillages() {
      if (this.$refs.villageSelect.validate()) {
        this.villageChoiceClose();
        this.villageChoiceReset();
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
