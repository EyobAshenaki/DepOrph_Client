<template>
  <div>
    <!-- dialog -->
    <div>
      <v-card link max-width="15rem" @click="dialog = true">
        <v-card-title class="headline justify-center">
          Educational Info
        </v-card-title>
      </v-card>
      <v-dialog v-model="dialog" max-width="60em">
        <v-card>
          <!-- <v-card-title>
            <span class="headline">{{ formTitle }}</span>
          </v-card-title> -->
          <!-- the form part; the fields part-->
          <v-card-text>
            <v-form
              ref="educationForm"
              v-model="validEducationForm"
              lazy-validation
            >
              <v-container>
                <v-row class="mt-2">
                  <!-- Enrollment Status -->
                  <v-col cols="12" sm="12" md="12">
                    <v-responsive max-width="200" class="">
                      <v-select
                        v-model="orphanEducationEnrollmentStatus"
                        :items="orphanEnrollmentStatusOptions"
                        :menu-props="{
                          bottom: true,
                          offsetY: true,
                        }"
                        :rules="[rules.required]"
                        label="Enrollment Status"
                      ></v-select>
                    </v-responsive>
                  </v-col>
                  <!-- If Enrolled or Drop-out -->
                  <template
                    v-if="
                      enrollmentStatusDisplay === 'Enrolled' ||
                        enrollmentStatusDisplay === 'Dropout'
                    "
                  >
                    <!-- Education Level -->
                    <v-col cols="12" sm="6" md="4">
                      <v-responsive max-width="270" class="">
                        <v-select
                          v-model="orphanEducationLevel"
                          :items="orphanEducationLevelOptions"
                          :menu-props="{
                            bottom: true,
                            offsetY: true,
                          }"
                          :rules="[rules.required]"
                          label="Education Level"
                        ></v-select>
                      </v-responsive>
                    </v-col>
                    <!-- Grade/Year -->
                    <v-col cols="12" sm="6" md="2">
                      <v-responsive max-width="" class="">
                        <v-select
                          v-model="orphanEducationYear"
                          :items="orphanEducationYearStateOptions"
                          :menu-props="{
                            bottom: true,
                            offsetY: true,
                          }"
                          :rules="[rules.required]"
                          label="Grade/Year"
                        ></v-select>
                      </v-responsive>
                    </v-col>
                  </template>
                  <!-- If Enrolled -->
                  <template v-if="enrollmentStatusDisplay === 'Enrolled'">
                    <!-- School Type -->
                    <v-col cols="12" sm="6" md="2">
                      <v-responsive max-width="" class="">
                        <v-select
                          v-model="orphan.education.typeOfSchool"
                          :items="orphanSchoolTypeOptions"
                          :menu-props="{
                            bottom: true,
                            offsetY: true,
                          }"
                          :rules="[rules.required]"
                          label="School Type"
                        ></v-select>
                      </v-responsive>
                    </v-col>
                    <!-- School/University Name -->
                    <v-col cols="12" sm="6" md="4">
                      <v-responsive max-width="" class="">
                        <v-text-field
                          v-model="orphan.education.schoolName"
                          :rules="[rules.required, rules.name]"
                          label="School/University Name"
                        >
                        </v-text-field>
                      </v-responsive>
                    </v-col>
                  </template>
                  <!-- If Drop-out -->
                  <template v-if="enrollmentStatusDisplay === 'Dropout'">
                    <!-- Reason for Drop-out -->
                    <v-col cols="12" sm="12" md="6">
                      <v-responsive max-width="" class="">
                        <v-text-field
                          v-model="orphan.education.reason"
                          :rules="[rules.required, rules.name]"
                          label="Reason for dropping out"
                        >
                        </v-text-field>
                      </v-responsive>
                    </v-col>
                  </template>
                  <!-- If Un-Enrolled -->
                  <template v-if="enrollmentStatusDisplay === 'Unenrolled'">
                    <!-- Reason for Un-Enrolled -->
                    <v-col cols="12" sm="12" md="6">
                      <v-responsive max-width="" class="">
                        <v-text-field
                          v-model="orphan.education.reason"
                          :rules="[rules.required, rules.name]"
                          label="Reason for not enrolling"
                        >
                        </v-text-field>
                      </v-responsive>
                    </v-col>
                  </template>
                  <!-- Reason for Un-Enrolled -->
                  <v-col cols="12" sm="12" md="6">
                    <v-responsive max-width="" class="">
                      <v-text-field
                        v-model="orphan.hobbies"
                        :rules="[rules.required, rules.name]"
                        label="Hobbies"
                      >
                      </v-text-field>
                    </v-responsive>
                  </v-col>
                </v-row>
              </v-container>
            </v-form>
          </v-card-text>
          <v-divider class="mt-3"></v-divider>
          <!-- the action part; the buttons part -->
          <v-card-actions>
            <v-btn color="red darken-1" text @click="educationDialogCancel">
              Cancel
            </v-btn>
            <v-spacer></v-spacer>
            <v-slide-x-reverse-transition>
              <v-tooltip v-if="formHasErrors" left>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    icon
                    class="my-0"
                    v-bind="attrs"
                    @click="educationDialogReset"
                    v-on="on"
                  >
                    <v-icon>mdi-refresh</v-icon>
                  </v-btn>
                </template>
                <span>Refresh form</span>
              </v-tooltip>
            </v-slide-x-reverse-transition>
            <v-btn
              color="blue darken-1"
              text
              @click="educationDialogNext"
              :disabled="!validEducationForm"
            >
              Next
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // dialog
      dialog: false,
      validEducationForm: null,
      formHasErrors: null,
      orphan: {
        hobbies: null,
        education: {
          enrollmentStatus: null,
          level: null,
          year: null,
          typeOfSchool: null,
          schoolName: null,
          reason: null,
        },
      },
      rules: {
        required: (value) => !!value || "Required.",
        name: (value) => {
          const namePattern = /(^[A-z][A-Z-a-z/'.,/]+)[A-z]\s*$/g;
          return namePattern.test(value) || "Invalid name";
        },
      },
      orphanEducationEnrollmentStatus: "",
      orphanEducationLevel: "",
      orphanEducationYear: "",
      orphanEnrollmentStatusOptions: ["Enrolled", "Drop-Out", "Un-Enrolled"],
      orphanSchoolTypeOptions: ["Public", "Private"],
      orphanEducationLevelOptions: [
        "Preschool",
        "Religious Education",
        "Primary/Elementary",
        "Junior",
        "Highschool",
        "Undergraduate",
        "Postgraduate",
      ],
      orphanEducationYearStateOptions: [],
      enrollmentStatusDisplay: "",
    };
  },
  computed: {},
  watch: {
    // set the Grade/Year based on Education Level
    orphanEducationLevel() {
      if (this.orphanEducationLevel === "Religious Education") {
        this.orphanEducationYearStateOptions = [1, 2, 3];
      } else if (this.orphanEducationLevel === "Preschool") {
        this.orphanEducationYearStateOptions = [
          "Preparatory",
          "Nursery",
          "LKG",
          "UKG",
        ];
      } else if (this.orphanEducationLevel === "Primary/Elementary") {
        this.orphanEducationYearStateOptions = [1, 2, 3, 4, 5, 6];
      } else if (this.orphanEducationLevel === "Junior") {
        this.orphanEducationYearStateOptions = [7, 8];
      } else if (this.orphanEducationLevel === "Highschool") {
        this.orphanEducationYearStateOptions = [9, 10, 11, 12];
      } else if (
        this.orphanEducationLevel === "Undergraduate" ||
        this.orphanEducationLevel === "Postgraduate"
      ) {
        this.orphanEducationYearStateOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      }
    },
    // show displayed boxes according to Enrollment Status
    orphanEducationEnrollmentStatus() {
      if (this.orphanEducationEnrollmentStatus === "Enrolled") {
        this.enrollmentStatusDisplay = "Enrolled";
      } else if (this.orphanEducationEnrollmentStatus === "Drop-Out") {
        this.enrollmentStatusDisplay = "Dropout";
      } else if (this.orphanEducationEnrollmentStatus === "Un-Enrolled") {
        this.enrollmentStatusDisplay = "Unenrolled";
      }
    },
    dialog(val) {
      val || this.educationDialogClose();
    },
  },
  methods: {
    educationDialogClose() {
      this.dialog = false;

      // this.$nextTick(() => {
      //   this.orphanItem = Object.assign({}, this.defaultItem);
      //   this.orphanIndex = -1;
      // });
    },

    educationDialogReset() {
      this.formHasErrors = false;
      this.$refs.educationForm.reset();

      // $$ This gets executed after the DOM have been renderd in the next event loop what ever that means
      // this.$nextTick(() => {
      //   this.orphanItem = Object.assign({}, this.defaultItem);
      //   this.orphanIndex = -1;
      // });
    },

    educationDialogNext() {
      // TODO # send a post request & clear the fields
      // if (this.orphanIndex > -1) {
      //   Object.assign(this.orphans[this.orphanIndex], this.orphanItem);
      // } else {
      //   this.orphans.push(this.orphanItem);
      // }
      this.formHasErrors = false;

      if (this.$refs.educationForm.validate()) {

        if (this.orphanEducationEnrollmentStatus === "Enrolled") {
          this.orphan.education.enrollmentStatus = "enrolled";
        } else if (this.orphanEducationEnrollmentStatus === "Drop-Out") {
          this.orphan.education.enrollmentStatus = "droppedout";
        } else if (this.orphanEducationEnrollmentStatus === "Un-Enrolled") {
          this.orphan.education.enrollmentStatus = "unenrolled";
        }

        if (this.orphanEducationLevel === "Religious Education") {
          this.orphan.education.level = "religiousEducation";
          this.orphan.education.year = this.orphanEducationYear;
        } else if (this.orphanEducationLevel === "Preschool") {
          this.orphan.education.level = "preSchool";
          if (this.orphanEducationYear === "Preparatory")
          this.orphan.education.year = 1;
          else if (this.orphanEducationYear === "Nursery")
          this.orphan.education.year = 2;
          else if (this.orphanEducationYear === "LKG")
          this.orphan.education.year = 3;
          else if (this.orphanEducationYear === "UKG")
          this.orphan.education.year = 4;
          else this.orphan.education.year = null;
        } else if (this.orphanEducationLevel === "Primary/Elementary" || this.orphanEducationLevel === "Junior" || this.orphanEducationLevel === "Highschool") {
          this.orphan.education.year = this.orphanEducationYear;
          this.orphan.education.level = "gradeSchool";
        } else if (this.orphanEducationLevel === "Undergraduate") {
          this.orphan.education.year = this.orphanEducationYear;
          this.orphan.education.level  = "underGraduate";
        } else if (this.orphanEducationLevel === "Postgraduate") {
          this.orphan.education.level = "postGraduate";
          this.orphan.education.year = this.orphanEducationYear;
        } else {
          this.orphan.education.level = "N_A";
        }
        
        this.orphan.education.typeOfSchool = this.orphan.education.typeOfSchool?.toLowerCase();

        this.$emit('educationDone', this.orphan)
        this.educationDialogClose();
      } else if (!this.$refs.educationForm.validate()) {
        this.formHasErrors = true;
      }
    },
    educationDialogCancel() {
      this.educationDialogReset();
      this.educationDialogClose();
    },
  },
};
</script>
