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
            <v-col cols="1" class="mt-4 mr-3 pt-5">
              <v-btn fab small elevation="1" right color="blue lighten-1">
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
              >
                <template v-slot:[`item.actions`]="{ item }">
                  <v-icon small class="mr-2" @click="openInsertImageDialog">
                    mdi-image-plus
                  </v-icon>

                  <v-icon small @click="openInsertERDialog(item)">
                    mdi-file-plus
                  </v-icon>
                  <v-dialog
                    v-model="insertImageDialog"
                    persistent
                    :retain-focus="false"
                    max-width="450"
                    overlay-color="#eee"
                    overlay-opacity=".3"
                  >
                    <v-card>
                      <v-card-title>Upload Photos</v-card-title>
                      <v-divider></v-divider>
                      <v-card-text>
                        <v-form
                          ref="imagesForm"
                          v-model="validImagesForm"
                          lazy-validation
                        >
                          <v-container>
                            <v-row
                              ><v-col cols="12"
                                ><v-file-input
                                  v-model="portraitImage"
                                  label="Portrait Photo"
                                  prepend-icon="mdi-camera-plus"
                                  accept="image/*"
                                  :rules="[rules.required]"
                                >
                                  <template v-slot:append>
                                    <v-tooltip top>
                                      <template
                                        v-slot:activator="{ on, attrs }"
                                      >
                                        <v-icon
                                          class="ml-auto"
                                          v-bind="attrs"
                                          v-on="on"
                                          @click="
                                            openPortraitImagePreviewDialog
                                          "
                                        >
                                          mdi-file-eye
                                        </v-icon>
                                      </template>
                                      <span>Preview</span>
                                    </v-tooltip>
                                    <v-dialog
                                      v-model="portraitImageDialog"
                                      max-height="600"
                                      max-width="400"
                                      overlay-color="#eee"
                                      overlay-opacity=".3"
                                    >
                                      <v-img
                                        :src="portraitImagePreview"
                                        contain
                                      ></v-img>
                                    </v-dialog>
                                  </template> </v-file-input></v-col
                            ></v-row>
                            <v-row
                              ><v-col cols="12"
                                ><v-file-input
                                  v-model="longImage"
                                  label="Long Photo"
                                  accept="image/*"
                                  prepend-icon="mdi-camera-plus"
                                  :rules="[rules.required]"
                                  ><template v-slot:append>
                                    <v-tooltip top>
                                      <template
                                        v-slot:activator="{ on, attrs }"
                                      >
                                        <v-icon
                                          class="ml-auto"
                                          v-bind="attrs"
                                          v-on="on"
                                          @click="openLongImagePreviewDialog"
                                        >
                                          mdi-file-eye
                                        </v-icon>
                                      </template>
                                      <span>Preview</span>
                                    </v-tooltip>
                                    <v-dialog
                                      v-model="longImageDialog"
                                      max-height="600"
                                      max-width="400"
                                      overlay-color="#eee"
                                      overlay-opacity=".3"
                                    >
                                      <v-img
                                        :src="longImagePreview"
                                        contain
                                      ></v-img>
                                    </v-dialog>
                                  </template> </v-file-input></v-col
                            ></v-row>
                          </v-container>
                        </v-form>
                      </v-card-text>
                      <v-divider></v-divider>
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn text color="#777" @click="closeImageInsertDialog"
                          >Close</v-btn
                        >
                        <v-btn
                          text
                          color="primary"
                          @click="saveImageInsertDialog(item)"
                          :disabled="!validImagesForm"
                          >Save</v-btn
                        >
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
                  <v-dialog
                    v-model="insertERDialog"
                    persistent
                    :retain-focus="false"
                    max-width="1377"
                    overlay-color="#eee"
                    overlay-opacity=".3"
                  >
                    <v-card>
                      <v-card-title
                        ><span> Educational Records</span> <v-spacer></v-spacer
                        ><v-btn color="primary">New Record</v-btn></v-card-title
                      >
                      <v-divider></v-divider>
                      <v-card-text>
                        <v-row>
                          <!-- Controls -->
                          <v-col cols="1"></v-col>
                        </v-row>
                        <v-row>
                          <!-- Table -->
                          <v-col cols="12">
                            <v-data-table
                              :items="ERTableRecords"
                              :headers="ERTableHeaders"
                              :items-per-page="itemsPerPage"
                              show-expand
                              single-expand
                              :expanded.sync="ERTableExpandedRecords"
                              item-key="id"
                            >
                              <template
                                v-slot:[`expanded-item`]="{ headers, item }"
                                right
                              >
                                <td :colspan="headers.length" class="px-0">
                                  <v-card class="elevation-1" tile>
                                    <v-card-title>Record Details</v-card-title>
                                    <v-divider></v-divider>
                                    <v-card-text cols="12">
                                      <v-row>
                                        <v-col
                                          ><p>
                                            School Name: {{ item.schoolName }}
                                          </p></v-col
                                        >
                                        <v-col
                                          ><p>
                                            Status:
                                            {{
                                              item.status
                                                .substring(0, 1)
                                                .toUpperCase()
                                            }}{{
                                              item.status
                                                .substring(1)
                                                .toLowerCase()
                                            }}
                                          </p></v-col
                                        >
                                        <v-col
                                          ><p>
                                            School Type:
                                            {{
                                              item.typeOfSchool
                                                .substring(0, 1)
                                                .toUpperCase()
                                            }}{{
                                              item.typeOfSchool
                                                .substring(1)
                                                .toLowerCase()
                                            }}
                                          </p></v-col
                                        >
                                      </v-row>
                                      <v-row>
                                        <v-col
                                          ><p>
                                            Education Level: {{ item.level }}
                                          </p></v-col
                                        ><v-col
                                          ><p>
                                            Year Division:
                                            {{
                                              item.yearDivision
                                                .substring(0, 1)
                                                .toUpperCase() == `S` ? `${item.yearDivision.substring(0, 1).toUpperCase()}${item.yearDivision.substring(1).toLowerCase()}` : `Quarter`
                                            }}
                                          </p></v-col
                                        ><v-col
                                          ><p>
                                            Current
                                            {{
                                              item.yearDivision
                                                .substring(0, 1)
                                                .toUpperCase() == "S"
                                                ? `Semester`
                                                : `Quarter`
                                            }}:
                                            {{
                                              item.yearDivision
                                                .substring(0, 1)
                                                .toUpperCase() == "S"
                                                ? `${item.semester
                                                    .substring(0, 1)
                                                    .toUpperCase()}${item.semester
                                                    .substring(1)
                                                    .toLowerCase()}`
                                                : `${item.quarter
                                                    .substring(0, 1)
                                                    .toUpperCase()}${item.quarter
                                                    .substring(1)
                                                    .toLowerCase()}`
                                            }}
                                          </p></v-col
                                        >
                                      </v-row>
                                      <v-row>
                                        <v-col cols="12">
                                          <v-img :src="item.reportCardUrl"></v-img>
                                        </v-col>
                                      </v-row>
                                    </v-card-text></v-card
                                  >
                                </td>
                              </template>
                            </v-data-table></v-col
                          >
                        </v-row>
                      </v-card-text>
                      <v-divider></v-divider>
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn
                          elevation="2"
                          class="mr-3 my-3 error"
                          @click="closeInsertERDialog"
                          >close</v-btn
                        >
                      </v-card-actions>
                    </v-card></v-dialog
                  >
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

<script>
import axios from "axios";
import moment from "moment";
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
        "Guardian Full Name",
        "Guardian Phone Number",
        "Account Number",
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
        {
          text: "Guardian Full Name",
          value: "guardianFullName"
        },
        {
          text: "Guardian Mobile Number",
          value: "guardianMobileNumber"
        },
        {
          text: "Account Number",
          value: "accountNumber"
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
      rules: {
        required: (value) => !!value || "Required."
      },
      // Image Upload Form Dialog
      insertImageDialog: false,
      portraitImage: null,
      portraitImagePreview: null,
      portraitImageDialog: null,
      longImage: null,
      longImagePreview: null,
      longImageDialog: null,
      validImagesForm: false,
      // Educational Record Upload From Dialog
      insertERDialog: false,
      ERTableRecords: [],
      ERTableHeaders: [
        {
          text: "Date",
          value: "created_at"
        },
        // {
        //   text: "Status",
        //   value: "status"
        // },
        // {
        //   text: "School Name",
        //   value: "schoolName"
        // },
        // {
        //   text: "Type",
        //   value: "typeOfSchool"
        // },
        {
          text: "Grade / Year",
          value: "year"
        },
        // {
        //   text: "Education Level",
        //   value: "eddLvl "
        // },
        // {
        //   text: "Division",
        //   value: "yearDivision"
        // },
        // {
        //   text: "Quarter",
        //   value: "quarter"
        // },
        // {
        //   text: "Semester",
        //   value: "semester"
        // },
        {
          text: "Total",
          value: "totalMark"
        },
        {
          text: "# Subjects",
          value: "numberOfSubjects"
        },
        {
          text: "Average",
          value: "average"
        },
        {
          text: "Rank",
          value: "rank"
        },
        {
          text: "SGPA",
          value: "semesterGPA"
        },
        {
          text: "CGPA",
          value: "cumulativeGPA"
        }
      ],
      ERTableExpandedRecords: []
    };
  },
  created() {
    this.initialize();
  },
  computed: {},
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
                        guardian {
                          firstName
                          middleName
                          lastName
                          mobileNumber
                        }
                        accountNumber
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
                guardianFullName: `${capitalize(
                  item.guardian.firstName
                )} ${capitalize(item.guardian.middleName)} ${capitalize(
                  item.guardian.lastName
                )}`,
                guardianMobileNumber: item.guardian.mobileNumber,
                accountNumber: item.accountNumber,
                district: item.village.district.name,
                village: item.village.name,
                donor: item.donor.nameInitials
              };
            });

            formattedOrphans.sort((a, b) => a.id - b.id);

            this.orphans = formattedOrphans;
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
    openInsertImageDialog() {
      this.insertImageDialog = true;
    },
    openPortraitImagePreviewDialog() {
      if (this.$refs.imagesForm.inputs[0].validate()) {
        this.portraitImagePreview = URL.createObjectURL(this.portraitImage);
        this.portraitImageDialog = true;
      }
    },
    openLongImagePreviewDialog() {
      if (this.$refs.imagesForm.inputs[1].validate()) {
        this.longImagePreview = URL.createObjectURL(this.longImage);
        this.longImageDialog = true;
      }
    },
    closeImageInsertDialog() {
      this.insertImageDialog = false;
    },
    saveImageInsertDialog(item) {
      this.snackText = "Uploading Images...";
      this.snackColor = "sky-blue";
      this.snack = true;
      console.log(this.snackText);
      if (this.$refs.imagesForm.validate()) {
        // (1) SEND IMAGES TO SERVER,
        // (2) GET IMAGES URLS,
        // (3) CREATE A DB RECORD,
        // (4) LOG CREATE RESULT

        // ! prep images before send
        const portraitImageFormData = new FormData();
        portraitImageFormData.append(
          "orphanPhotosPhotoPortrait",
          this.portraitImage,
          this.portraitImage.name
        );
        const longImageFormData = new FormData();
        longImageFormData.append(
          "orphanPhotosPhotoLong",
          this.longImage.this.longImage.name
        );
        // ! send and get urls
        (async () => {
          try {
            const portraitRes = axios.post(
              `/orphanPhotosPhotoPortrait`,
              portraitImageFormData
            );
            const longRes = axios.post(
              `/orphanPhotosPhotoLong`,
              longImageFormData
            );
            // ! create DB record with the urls
            try {
              (async () => {
                const query = `
                  mutation createPhotos(
                    $photoPortraitUrl: String!
                    $photoLongUrl: String
                    $orphanId: ID
                    ) {
                      createOrphanPhotos(
                        photoPortraitUrl: $photoPortraitUrl
                        photoLongUrl: $photoLongUrl
                        orphanId: $orphanId
                        ) { id }
                    }
                `;
                const queryOptions = {
                  query,
                  variables: {
                    photoPortraitUrl: portraitRes.data,
                    photoLongUrl: longRes.data,
                    orphanId: item.id
                  }
                };
                const createPhotosRes = await axios.post(
                  `/graphql/`,
                  queryOptions
                );
                // ! log create result
                console.log(createPhotosRes.data);
              })();
            } catch (err) {
              console.error(err);
            }
          } catch (error) {
            console.error(error);
          }
        })();
        this.insertImageDialog = false;
      }
    },
    openInsertERDialog(item) {
      console.log(`orphan.id: `, item.id);
      (async () => {
        try {
          const query = `
              query educationalRecordsByOrphanId($orphanId: ID!){
                  orphan(id:$orphanId){
                    education{
                      educationalRecords{
                        id
                        created_at
                        enrollmentStatus
                        schoolName
                        typeOfSchool
                        year
                        level
                        reason
                        yearDivision
                        quarter
                        semester
                        totalMark
                        numberOfSubjects
                        average
                        rank
                        reportCardUrl
                        semesterGPA
                        cumulativeGPA
                      }
                    }
                  }
                }
              `;
          const requestOptions = { query, variables: { orphanId: item.id } };
          const ERRes = await axios.post(`/graphql/`, requestOptions);
          console.log(ERRes.data.data.orphan.education.educationalRecords);
          let tempRecords = ERRes.data.data.orphan.education.educationalRecords.map(
            (item) => {
              let returnItem = { ...item };
              returnItem.status = item.enrollmentStatus;
              returnItem.level =
                item.level == "religiousEducation"
                  ? "Religious Education"
                  : item.level == "preSchool"
                  ? "Kindergarten (pre-school & KG)"
                  : item.level == "gradeSchool"
                  ? "Grade School"
                  : item.level == "underGraduate"
                  ? "Undergraduate (University / College)"
                  : item.level == "postGraduate"
                  ? "Postgraduate (University / College)"
                  : NaN;
                  returnItem.created_at = moment(item.created_at).format("DD / MM / YY")
              delete returnItem.enrollmentStatus;
              return returnItem;
            }
          );
          console.log(tempRecords);

          this.ERTableRecords = tempRecords;
        } catch (error) {
          console.error(error);
        }
      })();
      this.insertERDialog = true;
    },
    closeInsertERDialog() {
      this.insertERDialog = false;
    },
    saveInsertERDialog(item) {
      console.log(item);
    },

    // custom search function based on selected columns
    searchFilter(_value, search, item) {
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
              // filter by age only, N.B.: '0' , '<1' & '< 1' gives all marked by < 1
              return (
                item.age === parseInt(search) ||
                ((search == 0 || search == `< 1` || search == `<1`) &&
                  item.age === `< 1`)
              );
            } else if (filterVal === this.headers[3].text) {
              // filter by gender only
              return (
                item.gender.toLowerCase().indexOf(search.toLowerCase()) !== -1
              );
            } else if (filterVal === this.headers[4].text) {
              // filter by guardian full name only
              return (
                item.guardianFullName
                  .toLowerCase()
                  .indexOf(search.toLowerCase()) !== -1
              );
            } else if (filterVal === this.headers[5].text) {
              // filter by guardian mobile number only
              return (
                item.guardianMobileNumber
                  .toLowerCase()
                  .indexOf(search.toLowerCase()) !== -1
              );
            } else if (filterVal === this.headers[6].text) {
              // filter by account number only
              return (
                item.accountNumber
                  .toLowerCase()
                  .indexOf(search.toLowerCase()) !== -1
              );
            } else if (filterVal === this.headers[7].text) {
              // filter by district name only
              return (
                item.district.toLowerCase().indexOf(search.toLowerCase()) !== -1
              );
            } else if (filterVal === this.headers[8].text) {
              // filter by village name only
              return (
                item.village.toLowerCase().indexOf(search.toLowerCase()) !== -1
              );
            } else if (filterVal === this.headers[9].text) {
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
    }
  }
};
</script>

<style>
.v-dialog,
.v-menu__content {
  box-shadow: 0px 3px 1px -2px rgb(0 0 0 / 20%),
    0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%) !important;
}
</style>
