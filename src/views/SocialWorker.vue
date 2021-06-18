<template style="positon: relative;">
  <div style="min-width:1024px; min-height:768px">
    <v-row justify="center" no-gutters>
      <v-col cols="9" style="margin-top: 8rem">
        <v-card elevation="2">
          <v-row>
            <!-- TODO implement expanding button into the select-list  -->
            <v-col cols="1" class="mt-4 pt-5">
              <v-btn fab small class="ml-5" elevation="1" right color="#eee">
                <v-icon> mdi-filter </v-icon>
              </v-btn>
            </v-col>
            <v-col class="mt-6">
              <v-select
                v-model="filterValue"
                hint="select field/s to filter explicity"
                :items="filterItems"
                :menu-props="{ bottom: true, offsetY: true }"
                dense
                elevation="1"
                persistent-hint
                multiple
                placeholder="Filter By"
              >
                <template v-slot:selection="{ item, index }">
                  <v-chip
                    color="primary"
                    label
                    close
                    close-icon="mdi-close"
                    v-if="index === 0"
                  >
                    <span>{{ item }}</span>
                  </v-chip>
                  <span v-if="index === 1" class="grey--text caption">
                    (+{{ filterValue.length - 1 }} others)
                  </span>
                </template>
              </v-select>
            </v-col>
            <v-spacer></v-spacer>
            <v-col class="mt-3">
              <v-text-field v-model="search" placeholder="Search ..." />
            </v-col>
            <v-col cols="1" class="mt-4 pt-5">
              <v-btn
                fab
                small
                class="mr-5"
                elevation="1"
                right
                color="blue lighten-1"
              >
                <v-icon> mdi-account-search </v-icon>
              </v-btn>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12"
              ><v-data-table
                :headers="headers"
                :items="orphans"
                :items-per-page="itemsPerPage"
                :search="search"
                :custom-filter="searchFilter"
                dark
                fixed-header
              >
                <template v-slot:[`item.actions`]="{ item }">
                  <v-icon small class="mr-2" @click="editItem(item)">
                    mdi-image-plus
                  </v-icon>
                  <v-icon small @click="deleteItem(item)">
                    mdi-file-plus
                  </v-icon>
                </template>
              </v-data-table></v-col
            >
          </v-row></v-card
        >
      </v-col>
    </v-row>
    <!-- <v-row v-if="!showOrphans" justify="center" no-gutters>
      !-- Table Card --
      !-- TODO: # add a details column --
      !--       # impliment editable fullName * NEW FEATURE * --
      !--       # impliment a custom pagination --
      !--       # add chips in the sponsoreship status column --
      <v-col cols="9" style="margin-top: 8rem">
        <v-card elevation="2" class="mt-6" >
          <v-sheet
            id="scrolling-techniques-3"
            class="overflow-y-auto"
            max-height="83vh"
          >
            <v-data-table
              :headers="headers"
              :items="orphans"
              item-key="id"
              :search="search"
              append-icon="mdi-magnify"
              :custom-filter="searchFilter"
              multi-sort
              class="elevation-1"
            >
              <template v-slot:top>
                <v-row style="margin: 0px">
                  !-- Filter/Search Selection --
                  !-- TODO: # add close icon and function to remove from selection --
                  !--       # add tooltip maybe --
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
                        outlined
                        dense
                        persistent-hint
                        multiple
                        placeholder="Filter By"
                      >
                        <template v-slot:selection="{ item, index }">
                          <v-chip
                            color="rgba(19,84,122,.5)"
                            dark
                            label
                            close
                            close-icon="mdi-close-outline"
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
                  !-- Search Input --
                  !-- TODO: # add search icon and close icon --
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
              <template v-slot:item.donor="{ item }">
                {{ getVillageTableDonor(item) }}
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
            !-- becomes visble when full name is edited --
            !-- TODO: # Impliment a loding functionality --
            !--       # maybe server side validation also --
            <v-snackbar top right v-model="snack" :timeout="5000" :color="snackColor">
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
      <SocialWorkerOrphanList
        :orphanIds="selectedOrphanIds"
        @onBack="showOrphans = $event"
      />
    </v-fab-transition> -->
  </div>
</template>

<style scoped></style>

<script>
import axios from "axios";
import { capitalize, calculateAge } from "@/utils/utils.js";

export default {
  components: {},

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
        "ID",
        "Full Name",
        "Age",
        "Gender",
        "District",
        "Village",
        "Donor"
      ],
      filterValue: [],
      // used for filter selection
      // table headers if that wasn't clear enough LOL
      headers: [
        { text: "ID", value: "id" },
        {
          text: "Full Name",
          align: "start",
          value: "fullName"
        },
        {
          text: "Age",
          value: "age"
        },
        {
          text: "Gender",
          value: "gender"
        },
        // { text: "Sponsored Date", value: "sponsoredDate" },
        {
          text: "District",
          value: "district"
        },
        {
          text: "Village",
          align: "Start",
          value: "village"
        },
        // {
        //   text: "Registred on",
        //   value: "registrationDate",
        // },
        {
          text: "Donor",
          value: "donor"
        },
        {
          text: "Actions",
          value: "actions"
        }
      ],
      itemsPerPage: 20,
      // table rows/items
      orphans: [],
      villages: [],
      showOrphans: false,
      selectedOrphanIds: []
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
    }
    // used in new orphan dialog
  },
  watch: {},
  methods: {
    initialize() {
      this.snackText = `Login Successful! Welcome ${String(
        this.$route.params.firstName
      )
        .charAt(0)
        .toUpperCase()}${String(this.$route.params.firstName).substring(1)} `;
      this.snackColor = `green`;
      this.snack = true;
      let { id } = this.$route.params;

      (async () => {
        try {
          const query = `query socialWorker($id: ID!) {
                    socialWorker(id: $id) {
                      id
                      orphans {
                        id
                        firstName
                        father {
                          firstName
                          lastName
                        }
                        dateOfBirth
                        gender
                        village {
                          id
                          name
                          district {
                            id
                            name
                          }
                        }
                          donor {
                            id
                            nameInitials
                          }
                      }
                    }
                  }`;
          const requestOptions = { query, variables: { id } };
          const res = await axios.post("/graphql", requestOptions);
          if (res.data.errors) {
            throw new Error(res.data.errors[0].message.message);
          } else {
            const { socialWorker } = res.data.data;

            let formattedOrphans = socialWorker.orphans.map((item) => {
              return {
                id: item.id,
                fullName: `${capitalize(item.firstName)} ${capitalize(
                  item.father.firstName
                )} ${capitalize(item.father.lastName)}`,
                age: calculateAge(item.dateOfBirth),
                gender: item.gender,
                district: item.village.district.name,
                village: item.village.name,
                donor: item.donor.nameInitials
              };
            });
            formattedOrphans.sort((a,b) => a.id - b.id);

            this.orphans = formattedOrphans;

            for (const orphan of socialWorker.orphans) {
              this.villages.push(orphan.village);
            }
          }
        } catch (error) {
          console.log(error.message);
          if (
            error.message ===
            "Cannot return null for non-nullable field Query.socialWorker."
          ) {
            error.message = `Social worker  with id: ${id} doesn't exist.`;
          }
          this.snackText = error.message;
          this.snackColor = `red`;
          this.snack = true;
        }
      })();
    },
    getVillageTableId(item) {
      return item.village.id;
    },
    getVillageTableVillageName(item) {
      return item.village.name;
    },
    getVillageTableDistrict(item) {
      if (item.village.district === null) return "";
      return item.village.district.name;
    },
    getVillageTableDonor(item) {
      if (item.village.donor === null) return "";
      return item.village.donor.nameInitials;
    },
    goToOrphansTable(item) {
      this.showOrphans = true;
      this.selectedOrphanIds = item.id;
      console.log(item);
      console.log(this.selectedOrphanIds);
    },
    // custom search function based on selected columns
    searchFilter(value, search, item) {
      if (search.length > 0) {
        if (this.filterValue.length > 0) {
          for (const filterVal of this.filterValue) {
            if (filterVal === this.headers[0].text) {
              // filter by id only
              return item.id.indexOf(search) !== -1;
            } else if (filterVal === this.headers[1].text) {
              // filter by full name only
              return (
                item.fullName.toLowerCase().indexOf(search.toLowerCase()) !== -1
              );
            } else if (filterVal === this.headers[2].text) {
              // filter by age only, N.B.: '0' gives all marked by less than a year
              return (
                item.age === parseInt(search) ||
                (search == 0 && item.age === `Less than a year`)
              );
            } else if (filterVal === this.headers[3].text) {
              // filter by gender only
              return (
                item.gender.toLowerCase().indexOf(search.toLowerCase()) !== -1
              );
            } else if (filterVal === this.headers[4].text) {
              // filter by district name only
              return (
                item.district.toLowerCase().indexOf(search.toLowerCase()) !== -1
              );
            } else if (filterVal === this.headers[5].text) {
              // filter by village name only
              return (
                item.village.toLowerCase().indexOf(search.toLowerCase()) !== -1
              );
            } else if (filterVal === this.headers[6].text) {
              // filter by donor name initals only
              return (
                item.donor.toLowerCase().indexOf(search.toLowerCase()) !== -1
              );
            }
          }
        } else {
          // default search by full name
          return (
            item.fullName != null &&
            typeof item.fullName === "string" &&
            item.fullName
              .toString()
              .toLowerCase()
              .indexOf(search) !== -1
          );
        }
      }
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
    }
  }
};
</script>
