<template>
  <v-dialog
    v-model="detailDialog"
    transition="dialog-bottom-transition"
    fullscreen
    persistent
    max-width="600"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-icon color="primary" v-bind="attrs" v-on="on">
        mdi-account-details
      </v-icon>
    </template>
    <template v-slot:default="dialog">
      <v-card max-width="">
        <v-toolbar dense flat color="primary" dark>
          <span class="mx-auto">
            {{ "Name's Detail" }}
          </span>
        </v-toolbar>
        <v-card-text>
          <v-row class="mt-6">
            <!-- First Card -->
            <v-col cols="4" class="">
              <v-card elevation="3" class="pb-md-8">
                <v-row>
                  <v-col cols="12" class="text-center">
                    <v-avatar size="100" class="mt-15">
                      <img src="@/assets/id-photo2.jpg" alt="Orphan Photo" />
                    </v-avatar>
                  </v-col>
                  <v-col cols="12" class="py-0">
                    <div class="text-center text-h6 text-subtitle-1">
                      {{ orphanIdGenerator() }}
                    </div>
                  </v-col>
                  <v-col cols="12" class="pb-0">
                    <div class="text-center text-h6">
                      {{
                        orphan.firstName +
                          " " +
                          orphan.father.firstName +
                          " " +
                          orphan.father.lastName
                      }}
                    </div>
                  </v-col>
                  <!-- <v-col cols="12" class="py-0">
                    <div class="text-center text-subtitle-1 text--secondary">
                      {{ orphan.gender === "M" ? "Male" : "Femail" }}
                    </div>
                  </v-col> -->
                  <v-col cols="12" class="pb-0">
                    <div class="text-center text-body-1 text-capitalize">
                      {{
                        orphan.sponsorshipStatuses[
                          orphan.sponsorshipStatuses.length - 1
                        ].status
                      }}
                    </div>
                  </v-col>
                  <v-divider class="mx-6 my-6"></v-divider>
                  <v-col cols="12" class="text-center">
                    <v-btn
                      @click="toggleLongPhotoDialog"
                      width="90%"
                      color="primary"
                    >
                      View Full Photo
                    </v-btn>
                    <v-dialog v-model="longPhotoDialog">
                      <v-container>
                        <v-row>
                          <v-spacer></v-spacer>
                          <v-col class="mr-n12" sm="1">
                            <v-icon dark @click="toggleLongPhotoDialog">
                              mdi-close
                            </v-icon>
                          </v-col>
                        </v-row>
                        <v-img
                          height="82vh"
                          src="@/assets/1-crop.jpg"
                          contain
                          alt="long photo"
                        ></v-img>
                      </v-container>
                    </v-dialog>
                  </v-col>
                  <v-col cols="12" class="text-center">
                    <v-btn
                      @click="editProfile"
                      width="90%"
                      color="blue lighten-2"
                    >
                      {{ notEditable ? "Edit" : "Save" }}
                    </v-btn>
                  </v-col>
                </v-row>
              </v-card>
            </v-col>
            <!-- Second Card -->
            <v-col cols="8">
              <v-card elevation="3">
                <!-- #TODO => add icon to the tabs -->
                <v-tabs
                  centered
                  icons-and-text
                  slider-size="3"
                  slider-color="blue lighten-2"
                >
                  <v-tab> Personal </v-tab>
                  <v-tab-item>
                    <v-card flat>
                      <v-card-text>
                        <v-row>
                          <!-- first Name Label -->
                          <v-col
                            cols="12"
                            sm="6"
                            lg="4"
                            order-lg=""
                            class="pb-0 pt-5"
                          >
                            First Name
                          </v-col>
                          <!-- middle Name Label -->
                          <v-col
                            cols="12"
                            sm="6"
                            lg="4"
                            order-lg=""
                            class="pb-0 pt-5"
                          >
                            Middle Name
                          </v-col>
                          <!-- last Name Label -->
                          <v-col
                            cols="12"
                            sm="6"
                            lg="4"
                            order-lg=""
                            class="pb-0 pt-5"
                          >
                            Last Name
                          </v-col>
                          <!-- first Name textfield -->
                          <v-col
                            cols="12"
                            sm="6"
                            lg="4"
                            order-lg=""
                            class="pt-2 pb-0"
                          >
                            <v-text-field
                              v-model="orphanEditableFields.orphanFirstName"
                              solo
                              :readonly="notEditable"
                            ></v-text-field>
                          </v-col>
                          <!-- middle Name textfield -->
                          <v-col
                            cols="12"
                            sm="6"
                            lg="4"
                            order-lg=""
                            class="pt-2 pb-0"
                          >
                            <v-text-field
                              v-model="
                                orphanEditableFields.orphanFatherFirstName
                              "
                              solo
                              :readonly="notEditable"
                            ></v-text-field>
                          </v-col>
                          <!-- last Name textfield -->
                          <v-col
                            cols="12"
                            sm="6"
                            lg="4"
                            order-lg=""
                            class="pt-2 pb-0"
                          >
                            <v-text-field
                              v-model="
                                orphanEditableFields.orphanFatherLastName
                              "
                              solo
                              :readonly="notEditable"
                            ></v-text-field>
                          </v-col>
                          <!-- gender label -->
                          <v-col
                            cols="12"
                            sm="6"
                            lg="3"
                            order-lg=""
                            class="pb-0 pt-0"
                          >
                            Gender
                          </v-col>
                          <!-- birth Date label -->
                          <v-col
                            cols="12"
                            sm="6"
                            lg="4"
                            order-lg=""
                            class="pb-0 pt-0"
                          >
                            Birth Date
                          </v-col>
                          <!-- birth Place label -->
                          <v-col
                            cols="12"
                            sm="6"
                            lg="5"
                            order-lg=""
                            class="pb-0 pt-0"
                          >
                            Birth Place
                          </v-col>
                          <!-- gender textfield -->
                          <v-col
                            cols="12"
                            sm="6"
                            lg="3"
                            order-lg=""
                            class="pt-2 pb-0"
                          >
                            <v-select
                              v-if="!notEditable"
                              :items="orphanSelectOptions.genderOptions"
                              solo
                              v-model="orphanSelectedOption.orphanGender"
                            ></v-select>
                            <v-text-field
                              v-else
                              :value="
                                genderGenerator(
                                  orphanEditableFields.orphanGender
                                )
                              "
                              solo
                              :readonly="notEditable"
                            ></v-text-field>
                          </v-col>
                          <!-- #TODO => change into datepicker -->
                          <!-- birth Date textfield -->
                          <v-col
                            cols="12"
                            sm="6"
                            lg="4"
                            order-lg=""
                            class="pt-2 pb-0"
                          >
                            <v-text-field
                              :value="dateGenerator(orphan.dateOfBirth)"
                              solo
                              :readonly="notEditable"
                            ></v-text-field>
                          </v-col>
                          <!-- birth Place textfield -->
                          <v-col
                            cols="12"
                            sm="6"
                            lg="5"
                            order-lg=""
                            class="pt-2 pb-0"
                          >
                            <v-text-field
                              v-model="orphanEditableFields.orphanPlaceOfBirth"
                              solo
                              :readonly="notEditable"
                            ></v-text-field>
                          </v-col>
                          <!-- religion label -->
                          <v-col
                            cols="12"
                            sm="6"
                            lg="4"
                            order-lg=""
                            class="pb-0 pt-0"
                          >
                            Religion
                          </v-col>
                          <!-- spoken Language(s) label -->
                          <v-col
                            cols="12"
                            sm="6"
                            lg="5"
                            order-lg=""
                            class="pb-0 pt-0"
                          >
                            Spoken Language(s)
                          </v-col>
                          <!-- psycological Status label -->
                          <v-col
                            cols="12"
                            sm="6"
                            lg="3"
                            order-lg=""
                            class="pb-0 pt-0"
                          >
                            Psycological Status
                          </v-col>
                          <!-- religion textfield -->
                          <v-col
                            cols="12"
                            sm="6"
                            lg="4"
                            order-lg=""
                            class="pt-2 pb-0"
                          >
                            <v-select
                              v-if="!notEditable"
                              :items="orphanSelectOptions.orphanReligionOptions"
                              solo
                              v-model="orphanSelectedOption.orphanReligion"
                            ></v-select>
                            <v-text-field
                              v-else
                              :value="orphanEditableFields.orphanReligion"
                              solo
                              :readonly="notEditable"
                            ></v-text-field>
                          </v-col>
                          <!-- spoken Language(s) textfield -->
                          <v-col
                            cols="12"
                            sm="6"
                            lg="5"
                            order-lg=""
                            class="pt-2 pb-0"
                          >
                            <v-text-field
                              v-model="
                                orphanEditableFields.orphanSpokenLanguages
                              "
                              solo
                              :readonly="notEditable"
                            ></v-text-field>
                          </v-col>
                          <!-- psychological Status textfield -->
                          <v-col
                            cols="12"
                            sm="6"
                            lg="3"
                            order-lg=""
                            class="pt-2 pb-0"
                          >
                            <v-select
                              v-if="!notEditable"
                              :items="
                                orphanSelectOptions.orphanPsychologicalStatusOptions
                              "
                              solo
                              no-data-text="Select Status"
                              v-model="
                                orphanSelectedOption.orphanPsychologicalStatus
                              "
                            ></v-select>
                            <v-text-field
                              v-else
                              :value="
                                orphanEditableFields.orphanPsychologicalStatus
                              "
                              solo
                              :readonly="notEditable"
                            ></v-text-field>
                          </v-col>
                          <!-- health Description label -->
                          <v-col
                            cols="12"
                            sm="6"
                            lg="12"
                            order-lg=""
                            class="pb-0 pt-0"
                          >
                            Health Description
                          </v-col>
                          <!-- health Description textfield -->
                          <v-col
                            cols="12"
                            sm="6"
                            lg="6"
                            order-lg=""
                            class="pt-2 pb-0"
                          >
                            <v-textarea
                              :value="
                                orphanEditableFields.orphanHealthDescription
                              "
                              full-width
                              auto-grow
                              solo
                              :readonly="notEditable"
                            ></v-textarea>
                          </v-col>
                        </v-row>
                      </v-card-text>
                    </v-card>
                  </v-tab-item>
                  <v-tab> Education </v-tab>
                  <v-tab-item>
                    <v-card flat>
                      <v-card-text>
                        <v-row v-if="orphan.education !== null">
                          <!-- enrollment status label -->
                          <v-col
                            cols="12"
                            sm="6"
                            lg="4"
                            order-lg="first"
                            class="pb-0 pt-0"
                          >
                            Enrollment Status
                          </v-col>
                          <!-- if either Enrolled or Dropout label-->
                          <template
                            v-if="
                              orphan.education.enrollmentStatus ===
                                'enrolled' ||
                                orphan.education.enrollmentStatus ===
                                  'droppedout'
                            "
                            class="d-block"
                          >
                            <!-- education Level label -->
                            <v-col
                              cols="12"
                              sm="6"
                              lg="4"
                              order-lg="1"
                              class="pb-0 pt-0"
                            >
                              Education Level
                            </v-col>
                            <!-- grade/year label -->
                            <v-col
                              cols="12"
                              sm="6"
                              lg="4"
                              order-lg="2"
                              class="pb-0 pt-0"
                            >
                              Grade/Year
                            </v-col>
                          </template>
                          <!-- if enrolled only label-->
                          <template
                            v-if="
                              orphan.education.enrollmentStatus === 'enrolled'
                            "
                          >
                            <!-- school Type label -->
                            <v-col
                              cols="12"
                              sm="6"
                              lg="4"
                              order-lg="6"
                              class="pb-0 pt-0"
                            >
                              School Type
                            </v-col>
                            <!-- school/university Name label -->
                            <v-col
                              cols="12"
                              sm="6"
                              lg="4"
                              order-lg="7"
                              class="pb-0 pt-0"
                            >
                              School/University Name
                            </v-col>
                          </template>
                          <!-- if dropout only label-->
                          <template
                            v-if="
                              orphan.education.enrollmentStatus === 'droppedout'
                            "
                          >
                            <!-- reason for dropout label -->
                            <v-col
                              cols="12"
                              sm="6"
                              lg="5"
                              order-lg="6"
                              class="pb-0 pt-0"
                            >
                              Reason For Dropping out
                            </v-col>
                          </template>
                          <!-- if unenrollment only label-->
                          <template
                            v-if="
                              orphan.education.enrollmentStatus === 'unenrolled'
                            "
                          >
                            <!-- reason for unenrollment label -->
                            <v-col
                              cols="12"
                              sm="6"
                              lg="5"
                              order-lg="1"
                              class="pb-0 pt-0"
                            >
                              Reason For Unenrollment
                            </v-col>
                          </template>
                          <!-- hobbies label -->
                          <v-col
                            cols="12"
                            sm="6"
                            lg="4"
                            order-lg="8"
                            class="pb-0 pt-0"
                          >
                            Hobbies
                          </v-col>
                          <v-col
                            v-if="
                              orphan.education.enrollmentStatus === 'unenrolled'
                            "
                            lg="7"
                            order-lg="9"
                          ></v-col>

                          <!-- *********************************************************  -->

                          <!-- enrollment textfield -->
                          <v-col
                            cols="12"
                            sm="6"
                            lg="4"
                            order-lg="3"
                            class="pt-2 pb-0"
                          >
                            <v-select
                              v-if="!notEditable"
                              :items="
                                orphanSelectOptions.orphanEducationEnrollmentStatusOptions
                              "
                              solo
                              v-model="
                                orphanSelectedOption.orphanEducationEnrollmentStatus
                              "
                            ></v-select>
                            <v-text-field
                              v-else
                              :value="
                                orphanEditableFields.orphanEducationEnrollmentStatus
                              "
                              solo
                              :readonly="notEditable"
                            ></v-text-field>
                          </v-col>
                          <!-- if Enrolled or Dropout textfield-->
                          <template
                            v-if="
                              orphan.education.enrollmentStatus ===
                                'enrolled' ||
                                orphan.education.enrollmentStatus ===
                                  'droppedout'
                            "
                          >
                            <!-- education Level textfield -->
                            <v-col
                              cols="12"
                              sm="6"
                              lg="4"
                              order-lg="4"
                              class="pt-2 pb-0"
                            >
                              <v-select
                                v-if="!notEditable"
                                :items="
                                  orphanSelectOptions.orphanEducationLevelOptions
                                "
                                solo
                                v-model="
                                  orphanSelectedOption.orphanEducationLevel
                                "
                              ></v-select>
                              <v-text-field
                                v-else
                                :value="
                                  orphanEditableFields.orphanEducationLevel
                                "
                                solo
                                :readonly="notEditable"
                              ></v-text-field>
                            </v-col>
                            <!-- grade/year textfield -->
                            <v-col
                              cols="12"
                              sm="6"
                              lg="4"
                              order-lg="5"
                              class="pt-2 pb-0"
                            >
                              <v-text-field
                                v-model="
                                  orphanEditableFields.orphanEducationYear
                                "
                                :rules="[rules.educationGrade]"
                                validate-on-blur
                                solo
                                :readonly="notEditable"
                              ></v-text-field>
                            </v-col>
                          </template>
                          <!-- if enrolled only textfield-->
                          <template
                            v-if="
                              orphan.education.enrollmentStatus === 'enrolled'
                            "
                          >
                            <!-- school Type textfield -->
                            <v-col
                              cols="12"
                              sm="6"
                              lg="4"
                              order-lg="9"
                              class="pt-2 pb-0"
                            >
                              <v-select
                                v-if="!notEditable"
                                :items="
                                  orphanSelectOptions.orphanEducationTypeOptions
                                "
                                solo
                                v-model="
                                  orphanSelectedOption.orphanEducationType
                                "
                              ></v-select>
                              <v-text-field
                                v-else
                                :value="
                                  orphanEditableFields.orphanEducationType
                                "
                                solo
                                :readonly="notEditable"
                              ></v-text-field>
                            </v-col>
                            <!-- school/university Name textfield -->
                            <v-col
                              cols="12"
                              sm="6"
                              lg="4"
                              order-lg="10"
                              class="pt-2 pb-0"
                            >
                              <v-text-field
                                v-model="
                                  orphanEditableFields.orphanEducationSchoolName
                                "
                                solo
                                :readonly="notEditable"
                              ></v-text-field>
                            </v-col>
                          </template>
                          <!-- if dropout only textfield-->
                          <template
                            v-if="
                              orphan.education.enrollmentStatus === 'droppedout'
                            "
                          >
                            <!-- reason for dropout textfield -->
                            <v-col
                              cols="12"
                              sm="6"
                              lg="5"
                              order-lg="9"
                              class="pt-2 pb-0"
                            >
                              <v-text-field
                                :value="
                                  orphanEditableFields.orphanEducationReason
                                "
                                solo
                                :readonly="notEditable"
                              ></v-text-field>
                            </v-col>
                          </template>
                          <!-- if unenrolled only textfield -->
                          <template
                            v-if="
                              orphan.education.enrollmentStatus === 'unenrolled'
                            "
                          >
                            <!-- reason for unenrollment textfield -->
                            <v-col
                              cols="12"
                              sm="6"
                              lg="5"
                              order-lg="3"
                              class="pt-2 pb-0"
                            >
                              <v-text-field
                                :value="
                                  orphanEditableFields.orphanEducationReason
                                "
                                solo
                                :readonly="notEditable"
                              ></v-text-field>
                            </v-col>
                          </template>
                          <!-- hobbies textfield -->
                          <v-col
                            cols="12"
                            sm="6"
                            lg="4"
                            order-lg="last"
                            class="pt-2 pb-0"
                          >
                            <v-text-field
                              v-model="orphanEditableFields.orphanHobbies"
                              solo
                              :readonly="notEditable"
                            ></v-text-field>
                          </v-col>
                        </v-row>
                        <v-row v-else>
                          <!-- #TODO => finish this section with null handling  -->
                          <template class="mx-auto my-7">
                            NO EDUCATIONAL RECORD FOUND
                          </template>
                        </v-row>
                        <v-row>
                          <v-col cols="12">
                            EDUCATIONAL RECORD WILL GO HERE
                            <v-data-table
                              :headers="educationalRecordHeaders"
                              :items="educationalRecordItems"
                              class="elevation-1"
                            ></v-data-table>
                          </v-col>
                        </v-row>
                      </v-card-text>
                    </v-card>
                  </v-tab-item>
                  <v-tab> Family </v-tab>
                  <v-tab-item>
                    <v-card flat>
                      <v-card-text>
                        <!-- father section -->
                        <v-row v-if="orphan.father !== null">
                          <v-col cols="12" order-lg="first" class="pt-0">
                            <v-card-subtitle class="pb-2 pt-1">
                              FATHER INFORMATION
                            </v-card-subtitle>
                          </v-col>
                          <template cols="12">
                            <!-- father birth date label -->
                            <v-col
                              cols="12"
                              sm="6"
                              lg="4"
                              order-lg="1"
                              class="pb-0 pt-0 pl-12"
                            >
                              Birth Date
                            </v-col>
                            <!-- father death date label -->
                            <v-col
                              cols="12"
                              sm="6"
                              lg="4"
                              order-lg="2"
                              class="pb-0 pt-0"
                            >
                              Death Date
                            </v-col>
                            <!-- father cause of death label -->
                            <v-col
                              cols="12"
                              sm="6"
                              lg="4"
                              order-lg="3"
                              class="pb-0 pt-0"
                            >
                              Cause of Death
                            </v-col>
                            <!-- ****************************************************** -->
                            <!-- # TODO -->
                            <!-- father birth date textfield -->
                            <v-col
                              cols="12"
                              sm="6"
                              lg="4"
                              order-lg="4"
                              class="pt-2 pb-0 pl-12"
                            >
                              <v-text-field
                                :value="
                                  dateGenerator(orphan.father.dateOfBirth) ||
                                    'N/A'
                                "
                                solo
                                :readonly="notEditable"
                              ></v-text-field>
                            </v-col>
                            <!-- # TODO -->
                            <!-- father death date textfield -->
                            <v-col
                              cols="12"
                              sm="6"
                              lg="4"
                              order-lg="5"
                              class="pt-2 pb-0"
                            >
                              <v-text-field
                                :value="
                                  dateGenerator(orphan.father.dateOfDeath) ||
                                    'N/A'
                                "
                                solo
                                :readonly="notEditable"
                              ></v-text-field>
                            </v-col>
                            <!-- father cause of death textfield -->
                            <v-col
                              cols="12"
                              sm="6"
                              lg="4"
                              order-lg="6"
                              class="pt-2 pb-0"
                            >
                              <v-text-field
                                :value="
                                  orphanEditableFields.orphanFatherCauseOfDeath ||
                                    'N/A'
                                "
                                solo
                                :readonly="notEditable"
                              ></v-text-field>
                            </v-col>
                          </template>
                        </v-row>
                        <v-row v-else>
                          <template class="mx-auto my-7">
                            NO FATHER RECORD FOUND
                          </template>
                        </v-row>
                        <!-- mother section -->
                        <v-row v-if="orphan.mother !== null">
                          <v-col cols="12" order-lg="first" class="pt-0">
                            <v-card-subtitle class="pb-2 pt-1">
                              MOTHER INFORMATION
                            </v-card-subtitle>
                          </v-col>
                          <template cols="12">
                            <!-- mother first name label -->
                            <v-col
                              cols="12"
                              sm="6"
                              lg="4"
                              order-lg="first"
                              class="pb-0 pt-0 pl-12"
                            >
                              First Name
                            </v-col>
                            <!-- mother middle name label -->
                            <v-col
                              cols="12"
                              sm="6"
                              lg="4"
                              order-lg="1"
                              class="pb-0 pt-0 pl-12"
                            >
                              Middle Name
                            </v-col>
                            <!-- mother last name label -->
                            <v-col
                              cols="12"
                              sm="6"
                              lg="4"
                              order-lg="2"
                              class="pb-0 pt-0 pl-12"
                            >
                              Last Name
                            </v-col>
                            <!-- mother birth date label -->
                            <v-col
                              cols="12"
                              sm="6"
                              lg="3"
                              order-lg="6"
                              class="pb-0 pt-0 pl-12"
                            >
                              Birth Date
                            </v-col>
                            <!-- mother vital Status label -->
                            <v-col
                              cols="12"
                              sm="6"
                              lg="3"
                              order-lg="7"
                              class="pb-0 pt-0 pl-12"
                            >
                              Vital Status
                            </v-col>
                            <!-- if mother still alive -->
                            <template
                              v-if="orphan.mother.vitalStatus === 'alive'"
                            >
                              <!-- mother marital Status label -->
                              <v-col
                                cols="12"
                                sm="6"
                                lg="3"
                                order-lg="8"
                                class="pb-0 pt-0 pl-12"
                              >
                                Marital Status
                              </v-col>
                              <!-- mother mobile number label -->
                              <v-col
                                cols="12"
                                sm="6"
                                lg="3"
                                order-lg="9"
                                class="pb-0 pt-0 pl-12"
                              >
                                Mobile Number
                              </v-col>
                            </template>
                            <!-- if mother passed away -->
                            <template
                              v-if="orphan.mother.vitalStatus === 'passed'"
                            >
                              <!-- mother death date label -->
                              <v-col
                                cols="12"
                                sm="6"
                                lg="3"
                                order-lg="8"
                                class="pb-0 pt-0"
                              >
                                Death Date
                              </v-col>
                              <!-- mother cause of death label -->
                              <v-col
                                cols="12"
                                sm="6"
                                lg="3"
                                order-lg="9"
                                class="pb-0 pt-0"
                              >
                                Cause of Death
                              </v-col>
                            </template>
                            <!-- ****************************************************** -->
                            <!-- mother first name textfield -->
                            <v-col
                              cols="12"
                              sm="6"
                              lg="4"
                              order-lg="3"
                              class="pt-2 pb-0 pl-12"
                            >
                              <v-text-field
                                :value="
                                  orphanEditableFields.orphanMotherFirstName ||
                                    'N/A'
                                "
                                solo
                                :readonly="notEditable"
                              ></v-text-field>
                            </v-col>
                            <!-- mother middle name textfield -->
                            <v-col
                              cols="12"
                              sm="6"
                              lg="4"
                              order-lg="4"
                              class="pt-2 pb-0 pl-12"
                            >
                              <v-text-field
                                :value="
                                  orphanEditableFields.orphanMotherMiddleName ||
                                    'N/A'
                                "
                                solo
                                :readonly="notEditable"
                              ></v-text-field>
                            </v-col>
                            <!-- mother last name textfield -->
                            <v-col
                              cols="12"
                              sm="6"
                              lg="4"
                              order-lg="5"
                              class="pt-2 pb-0 pl-12"
                            >
                              <v-text-field
                                :value="
                                  orphanEditableFields.orphanMotherLastName ||
                                    'N/A'
                                "
                                solo
                                :readonly="notEditable"
                              ></v-text-field>
                            </v-col>
                            <!-- mother birth date textfield -->
                            <v-col
                              cols="12"
                              sm="6"
                              lg="3"
                              order-lg="10"
                              class="pt-2 pb-0 pl-12"
                            >
                              <v-text-field
                                :value="
                                  dateGenerator(orphan.mother.dateOfBirth) ||
                                    'N/A'
                                "
                                solo
                                :readonly="notEditable"
                              ></v-text-field>
                            </v-col>
                            <!-- mother vital status textfield -->
                            <v-col
                              cols="12"
                              sm="6"
                              lg="3"
                              order-lg="11"
                              class="pt-2 pb-0 pl-12"
                            >
                              <v-select
                                v-if="!notEditable"
                                :items="
                                  orphanSelectOptions.orphanMotherVitalStatusOptions
                                "
                                solo
                                v-model="
                                  orphanSelectedOption.orphanMotherVitalStatus
                                "
                              ></v-select>
                              <v-text-field
                                v-else
                                :value="
                                  orphanEditableFields.orphanMotherVitalStatus
                                "
                                solo
                                :readonly="notEditable"
                              ></v-text-field>
                            </v-col>
                            <!-- if mother still alive -->
                            <template
                              v-if="orphan.mother.vitalStatus === 'alive'"
                            >
                              <!-- mother marital status textfield -->
                              <v-col
                                cols="12"
                                sm="6"
                                lg="3"
                                order-lg="12"
                                class="pt-2 pb-0 pl-12"
                              >
                                <v-select
                                  v-if="!notEditable"
                                  :items="
                                    orphanSelectOptions.orphanMotherMaritalStatusOptions
                                  "
                                  solo
                                  v-model="
                                    orphanSelectedOption.orphanMotherMaritalStatus
                                  "
                                ></v-select>
                                <v-text-field
                                  v-else
                                  :value="
                                    orphanEditableFields.orphanMotherMaritalStatus
                                  "
                                  solo
                                  :readonly="notEditable"
                                ></v-text-field>
                              </v-col>
                              <!-- mother mobile number textfield -->
                              <v-col
                                cols="12"
                                sm="6"
                                lg="3"
                                order-lg="last"
                                class="pt-2 pb-0 pl-12"
                              >
                                <v-text-field
                                  :value="
                                    orphanEditableFields.orphanMotherMobileNumber ||
                                      'N/A'
                                  "
                                  solo
                                  :readonly="notEditable"
                                ></v-text-field>
                              </v-col>
                            </template>
                            <!-- if mother passed away -->
                            <template
                              v-if="orphan.mother.vitalStatus === 'passed'"
                            >
                              <!-- mother death date textfield -->
                              <v-col
                                cols="12"
                                sm="6"
                                lg="3"
                                order-lg="12"
                                class="pt-2 pb-0"
                              >
                                <v-text-field
                                  :value="
                                    dateGenerator(orphan.mother.dateOfDeath) ||
                                      'N/A'
                                  "
                                  solo
                                  :readonly="notEditable"
                                ></v-text-field>
                              </v-col>
                              <!-- mother cause of death textfield -->
                              <v-col
                                cols="12"
                                sm="6"
                                lg="3"
                                order-lg="last"
                                class="pt-2 pb-0"
                              >
                                <v-text-field
                                  :value="
                                    orphanEditableFields.orphanMotherCauseOfDeath ||
                                      'N/A'
                                  "
                                  solo
                                  :readonly="notEditable"
                                ></v-text-field>
                              </v-col>
                            </template>
                          </template>
                        </v-row>
                        <v-row v-else>
                          <template class="mx-auto my-7">
                            NO MOTHER RECORD FOUND
                          </template>
                        </v-row>
                        <!-- house property section -->
                        <v-row v-if="orphan.house_property !== null">
                          <v-col cols="12" order-lg="first" class="pt-0">
                            <v-card-subtitle class="pb-2 pt-1">
                              HOUSING INFORMATION
                            </v-card-subtitle>
                          </v-col>
                          <!-- Housing Situation label -->
                          <v-col
                            cols="12"
                            sm="6"
                            lg="6"
                            order-lg="first"
                            class="pb-0 pt-0 pl-12"
                          >
                            Housing Situation
                          </v-col>
                          <!-- other property label -->
                          <v-col
                            cols="12"
                            sm="6"
                            lg="6"
                            order-lg="1"
                            class="pb-0 pt-0"
                          >
                            Other Property
                          </v-col>
                          <!-- ********************************************* -->
                          <!-- housing situation textfield -->
                          <v-col
                            cols="12"
                            sm="6"
                            lg="6"
                            order-lg="2"
                            class="pt-2 pb-0 pl-12"
                          >
                            <v-text-field
                              v-model="
                                orphanEditableFields.orphanHouse_propertyHousingSituation
                              "
                              solo
                              :readonly="notEditable"
                            ></v-text-field>
                          </v-col>
                          <!-- other property textfield -->
                          <v-col
                            cols="12"
                            sm="6"
                            lg="6"
                            order-lg="last"
                            class="pt-2 pb-0"
                          >
                            <v-text-field
                              v-model="
                                orphanEditableFields.orphanHouse_propertyOtherProperty
                              "
                              solo
                              :readonly="notEditable"
                            ></v-text-field>
                          </v-col>
                        </v-row>
                        <v-row v-else>
                          <template class="mx-auto my-7">
                            NO HOUSE-PROPERTY RECORD FOUND
                          </template>
                        </v-row>
                      </v-card-text>
                    </v-card>
                  </v-tab-item>
                  <v-tab> Guardian </v-tab>
                  <v-tab-item>
                    <v-card flat>
                      <v-card-text>
                        <v-row v-if="orphan.guardian !== null">
                          <!-- guardian first name label -->
                          <v-col
                            cols="12"
                            sm="6"
                            lg="4"
                            order-lg=""
                            class="pb-0 pt-0 pl-12"
                          >
                            First Name
                          </v-col>
                          <!-- guardian middle name label -->
                          <v-col
                            cols="12"
                            sm="6"
                            lg="4"
                            order-lg=""
                            class="pb-0 pt-0 pl-12"
                          >
                            Middle Name
                          </v-col>
                          <!-- guardian last name label -->
                          <v-col
                            cols="12"
                            sm="6"
                            lg="4"
                            order-lg=""
                            class="pb-0 pt-0 pl-12"
                          >
                            Last Name
                          </v-col>
                          <!-- guardian first name textfield -->
                          <v-col
                            cols="12"
                            sm="6"
                            lg="4"
                            order-lg=""
                            class="pt-2 pb-0 pl-12"
                          >
                            <v-text-field
                              v-model="
                                orphanEditableFields.orphanGuardianFirstName
                              "
                              solo
                              :readonly="notEditable"
                            ></v-text-field>
                          </v-col>
                          <!-- guardian middle name textfield -->
                          <v-col
                            cols="12"
                            sm="6"
                            lg="4"
                            order-lg=""
                            class="pt-2 pb-0 pl-12"
                          >
                            <v-text-field
                              v-model="
                                orphanEditableFields.orphanGuardianMiddleName
                              "
                              solo
                              :readonly="notEditable"
                            ></v-text-field>
                          </v-col>
                          <!-- guardian last name textfield -->
                          <v-col
                            cols="12"
                            sm="6"
                            lg="4"
                            order-lg=""
                            class="pt-2 pb-0 pl-12"
                          >
                            <v-text-field
                              v-model="
                                orphanEditableFields.orphanGuardianLastName
                              "
                              solo
                              :readonly="notEditable"
                            ></v-text-field>
                          </v-col>
                          <!-- guardian gender label -->
                          <v-col
                            cols="12"
                            sm="6"
                            lg="3"
                            order-lg=""
                            class="pb-0 pt-0 pl-12"
                          >
                            Gender
                          </v-col>
                          <!-- guardian email label -->
                          <v-col
                            cols="12"
                            sm="6"
                            lg="5"
                            order-lg=""
                            class="pb-0 pt-0 pl-12"
                          >
                            E-mail
                          </v-col>
                          <!-- guardian mobile number label -->
                          <v-col
                            cols="12"
                            sm="6"
                            lg="4"
                            order-lg=""
                            class="pb-0 pt-0 pl-12"
                          >
                            Mobile Number
                          </v-col>
                          <!-- guardian gender textfield -->
                          <v-col
                            cols="12"
                            sm="6"
                            lg="3"
                            order-lg=""
                            class="pt-2 pb-0 pl-12"
                          >
                            <v-select
                              v-if="!notEditable"
                              :items="orphanSelectOptions.genderOptions"
                              solo
                              v-model="
                                orphanSelectedOption.orphanGuardianGender
                              "
                            ></v-select>
                            <v-text-field
                              v-else
                              :value="
                                genderGenerator(
                                  orphanEditableFields.orphanGuardianGender
                                )
                              "
                              solo
                              :readonly="notEditable"
                            ></v-text-field>
                          </v-col>
                          <!-- guardian email textfield -->
                          <v-col
                            cols="12"
                            sm="6"
                            lg="5"
                            order-lg=""
                            class="pt-2 pb-0 pl-12"
                          >
                            <v-text-field
                              v-model="orphanEditableFields.orphanGuardianEmail"
                              solo
                              :readonly="notEditable"
                            ></v-text-field>
                          </v-col>
                          <!-- guardian mobile number textfield -->
                          <v-col
                            cols="12"
                            sm="6"
                            lg="4"
                            order-lg=""
                            class="pt-2 pb-0 pl-12"
                          >
                            <v-text-field
                              v-model="
                                orphanEditableFields.orphanGuardianMobileNumber
                              "
                              solo
                              :readonly="notEditable"
                            ></v-text-field>
                          </v-col>

                          <!-- guardian birth date label -->
                          <v-col
                            cols="12"
                            sm="6"
                            lg="3"
                            order-lg=""
                            class="pb-0 pt-0 pl-12"
                          >
                            Birth Date
                          </v-col>
                          <!-- guardian relation to orphan label -->
                          <v-col
                            cols="12"
                            sm="6"
                            lg="3"
                            order-lg=""
                            class="pb-0 pt-0 pl-12"
                          >
                            Relation to Orphan
                          </v-col>
                          <!-- guardian nationality label -->
                          <v-col
                            cols="12"
                            sm="6"
                            lg="3"
                            order-lg=""
                            class="pb-0 pt-0 pl-12"
                          >
                            Nationality
                          </v-col>
                          <!-- guardian telephone number label -->
                          <v-col
                            cols="12"
                            sm="6"
                            lg="3"
                            order-lg=""
                            class="pb-0 pt-0 pl-12"
                          >
                            Telephone Number
                          </v-col>
                          <!-- guardian birth date textfield -->
                          <v-col
                            cols="12"
                            sm="6"
                            lg="3"
                            order-lg=""
                            class="pt-2 pb-0 pl-12"
                          >
                            <v-text-field
                              :value="
                                dateGenerator(orphan.guardian.dateOfBirth) ||
                                  'N/A'
                              "
                              solo
                              :readonly="notEditable"
                            ></v-text-field>
                          </v-col>
                          <!-- guardian relation to orphan textfield -->
                          <v-col
                            cols="12"
                            sm="6"
                            lg="3"
                            order-lg=""
                            class="pt-2 pb-0 pl-12"
                          >
                            <v-select
                              v-if="!notEditable"
                              :items="
                                orphanSelectOptions.orphanGuardianRelationToOrphanOptions
                              "
                              solo
                              v-model="
                                orphanSelectedOption.orphanGuardianRelationToOrphan
                              "
                            ></v-select>
                            <v-text-field
                              v-else
                              :value="
                                orphanEditableFields.orphanGuardianRelationToOrphan
                              "
                              solo
                              :readonly="notEditable"
                            ></v-text-field>
                          </v-col>
                          <!-- guardian nationality textfield -->
                          <v-col
                            cols="12"
                            sm="6"
                            lg="3"
                            order-lg=""
                            class="pt-2 pb-0 pl-12"
                          >
                            <v-select
                              v-if="!notEditable"
                              :items="
                                orphanSelectOptions.orphanGuardianNationalityOptions
                              "
                              solo
                              :value="
                                orphanSelectedOption.orphanGuardianNationality
                              "
                            ></v-select>
                            <v-text-field
                              v-else
                              v-model="
                                orphanEditableFields.orphanGuardianNationality
                              "
                              solo
                              :readonly="notEditable"
                            ></v-text-field>
                          </v-col>
                          <!-- guardian telephone number textfield -->
                          <v-col
                            cols="12"
                            sm="6"
                            lg="3"
                            order-lg=""
                            class="pt-2 pb-0 pl-12"
                          >
                            <v-text-field
                              v-model="
                                orphanEditableFields.orphanGuardianTelephoneNumber
                              "
                              solo
                              :readonly="notEditable"
                            ></v-text-field>
                          </v-col>
                          <!-- guardian job title label -->
                          <v-col
                            cols="12"
                            sm="6"
                            lg="12"
                            order-lg=""
                            class="pb-0 pt-0 pl-12"
                          >
                            Job Title
                          </v-col>
                          <!-- guardian job title textfield -->
                          <v-col
                            cols="12"
                            sm="6"
                            lg="5"
                            order-lg=""
                            class="pt-2 pb-0 pl-12"
                          >
                            <v-text-field
                              v-model="
                                orphanEditableFields.orphanGuardianJobTitle
                              "
                              solo
                              :readonly="notEditable"
                            ></v-text-field>
                          </v-col>
                        </v-row>
                        <v-row v-else>
                          <template class="mx-auto my-7">
                            NO GUARDIAN RECORD FOUND
                          </template>
                        </v-row>
                      </v-card-text>
                    </v-card>
                  </v-tab-item>
                  <!-- #TODO => make one dialog to show all the documents not separate once -->
                  <v-tab> Documents </v-tab>
                  <v-tab-item>
                    <v-card flat>
                      <v-card-text>
                        <v-row>
                          <v-col cols="12" order-lg="" class="pt-0">
                            <v-card-subtitle class="pb-2 pt-1">
                              ORPHAN DOCUMENTS
                            </v-card-subtitle>
                          </v-col>
                          <v-col>
                            <v-hover>
                              <template v-slot:default="{ hover }">
                                <v-card height="350" width="250" elevation="4">
                                  <v-img src="@/assets/d1.jpg"></v-img>
                                  <v-fade-transition>
                                    <v-overlay v-if="hover" absolute>
                                      <v-row class="pb-6">
                                        <v-col cols="12" class="text-center">
                                          <span>Id Card</span>
                                        </v-col>
                                        <v-col cols="12" class="text-center">
                                          <v-btn
                                            fab
                                            color="primary"
                                            @click="showFullImage(hover)"
                                          >
                                            <v-icon> mdi-magnify-plus </v-icon>
                                          </v-btn>
                                        </v-col>
                                      </v-row>
                                    </v-overlay>
                                  </v-fade-transition>
                                </v-card>
                              </template>
                            </v-hover>
                          </v-col>
                          <v-col>
                            <v-hover>
                              <template v-slot:default="{ hover }">
                                <v-card height="350" width="250" elevation="4">
                                  <v-img src="@/assets/d2.jpg"></v-img>
                                  <v-fade-transition>
                                    <v-overlay v-if="hover" absolute>
                                      <v-row class="pb-6">
                                        <v-col cols="12" class="text-center">
                                          <span>Passport</span>
                                        </v-col>
                                        <v-col cols="12" class="text-center">
                                          <v-btn
                                            fab
                                            color="primary"
                                            @click="showFullImage(hover)"
                                          >
                                            <v-icon> mdi-magnify-plus </v-icon>
                                          </v-btn>
                                        </v-col>
                                      </v-row>
                                    </v-overlay>
                                  </v-fade-transition>
                                </v-card>
                              </template>
                            </v-hover>
                          </v-col>
                          <v-col>
                            <v-hover>
                              <template v-slot:default="{ hover }">
                                <v-card height="350" width="250" elevation="4">
                                  <v-img src="@/assets/d3.png"></v-img>
                                  <v-fade-transition>
                                    <v-overlay v-if="hover" absolute>
                                      <v-row class="pb-6">
                                        <v-col cols="12" class="text-center">
                                          <span>Birth Certificate</span>
                                        </v-col>
                                        <v-col cols="12" class="text-center">
                                          <v-btn
                                            fab
                                            color="primary"
                                            @click="showFullImage(hover)"
                                          >
                                            <v-icon> mdi-magnify-plus </v-icon>
                                          </v-btn>
                                        </v-col>
                                      </v-row>
                                    </v-overlay>
                                  </v-fade-transition>
                                </v-card>
                              </template>
                            </v-hover>
                          </v-col>
                          <v-col>
                            <v-hover>
                              <template v-slot:default="{ hover }">
                                <v-card height="350" width="250" elevation="4">
                                  <v-img src="@/assets/d4.jpg"></v-img>
                                  <v-fade-transition>
                                    <v-overlay v-if="hover" absolute>
                                      <v-row class="pb-6">
                                        <v-col cols="12" class="text-center">
                                          <span>Thankyou Letter</span>
                                        </v-col>
                                        <v-col cols="12" class="text-center">
                                          <v-btn
                                            fab
                                            color="primary"
                                            @click="showFullImage(hover)"
                                          >
                                            <v-icon> mdi-magnify-plus </v-icon>
                                          </v-btn>
                                        </v-col>
                                      </v-row>
                                    </v-overlay>
                                  </v-fade-transition>
                                </v-card>
                              </template>
                            </v-hover>
                          </v-col>
                          <v-col cols="12">
                            <v-divider></v-divider>
                          </v-col>
                          <v-col cols="12" order-lg="" class="pt-0">
                            <v-card-subtitle class="pb-2 pt-1">
                              FATHER DOCUMENTS
                            </v-card-subtitle>
                          </v-col>
                          <v-col>
                            <v-hover>
                              <template v-slot:default="{ hover }">
                                <v-card height="350" width="250" elevation="4">
                                  <v-img src="@/assets/d5.jpg"></v-img>
                                  <v-fade-transition>
                                    <v-overlay v-if="hover" absolute>
                                      <v-row class="pb-6">
                                        <v-col cols="12" class="text-center">
                                          <span>Death Certificate</span>
                                        </v-col>
                                        <v-col cols="12" class="text-center">
                                          <v-btn
                                            fab
                                            color="primary"
                                            @click="showFullImage(hover)"
                                          >
                                            <v-icon> mdi-magnify-plus </v-icon>
                                          </v-btn>
                                        </v-col>
                                      </v-row>
                                    </v-overlay>
                                  </v-fade-transition>
                                </v-card>
                              </template>
                            </v-hover>
                          </v-col>
                          <v-col cols="12">
                            <v-divider></v-divider>
                          </v-col>
                          <v-col cols="12" order-lg="" class="pt-0">
                            <v-card-subtitle class="pb-2 pt-1">
                              GUARDIAN DOCUMENTS
                            </v-card-subtitle>
                          </v-col>
                          <v-col>
                            <v-hover>
                              <template v-slot:default="{ hover }">
                                <v-card height="350" width="250" elevation="4">
                                  <v-img src="@/assets/d6.jpg"></v-img>
                                  <v-fade-transition>
                                    <v-overlay v-if="hover" absolute>
                                      <v-row class="pb-6">
                                        <v-col cols="12" class="text-center">
                                          <span>Id Card</span>
                                        </v-col>
                                        <v-col cols="12" class="text-center">
                                          <v-btn
                                            fab
                                            color="primary"
                                            @click="showFullImage(hover)"
                                          >
                                            <v-icon> mdi-magnify-plus </v-icon>
                                          </v-btn>
                                        </v-col>
                                      </v-row>
                                    </v-overlay>
                                  </v-fade-transition>
                                </v-card>
                              </template>
                            </v-hover>
                          </v-col>
                          <v-col>
                            <v-hover>
                              <template v-slot:default="{ hover }">
                                <v-card height="350" width="250" elevation="4">
                                  <v-img src="@/assets/d7.jpg"></v-img>
                                  <v-fade-transition>
                                    <v-overlay v-if="hover" absolute>
                                      <v-row class="pb-6">
                                        <v-col cols="12" class="text-center">
                                          <span>Confirmation Letter</span>
                                        </v-col>
                                        <v-col cols="12" class="text-center">
                                          <v-btn
                                            fab
                                            color="primary"
                                            @click="showFullImage(hover)"
                                          >
                                            <v-icon> mdi-magnify-plus </v-icon>
                                          </v-btn>
                                        </v-col>
                                      </v-row>
                                    </v-overlay>
                                  </v-fade-transition>
                                </v-card>
                              </template>
                            </v-hover>
                          </v-col>
                          <v-col>
                            <v-hover>
                              <template v-slot:default="{ hover }">
                                <v-card height="350" width="250" elevation="4">
                                  <v-img src="@/assets/d8.jpg"></v-img>
                                  <v-fade-transition>
                                    <v-overlay v-if="hover" absolute>
                                      <v-row class="pb-6">
                                        <v-col cols="12" class="text-center">
                                          <span>Legal Confirmation Letter</span>
                                        </v-col>
                                        <v-col cols="12" class="text-center">
                                          <v-btn
                                            fab
                                            color="primary"
                                            @click="showFullImage(hover)"
                                          >
                                            <v-icon> mdi-magnify-plus </v-icon>
                                          </v-btn>
                                        </v-col>
                                      </v-row>
                                    </v-overlay>
                                  </v-fade-transition>
                                </v-card>
                              </template>
                            </v-hover>
                          </v-col>
                          <v-col cols="12">
                            <v-divider></v-divider>
                          </v-col>
                          <!-- #TODO => use window to do the educational records if possible -->
                          <v-col cols="12" order-lg="" class="pt-0">
                            <v-card-subtitle class="pb-2 pt-1">
                              EDUCATION DOCUMENTS
                            </v-card-subtitle>
                          </v-col>
                          <v-col>
                            <v-hover>
                              <template v-slot:default="{ hover }">
                                <v-card height="350" width="250" elevation="4">
                                  <v-img src="@/assets/d9.jpg"></v-img>
                                  <v-fade-transition>
                                    <v-overlay v-if="hover" absolute>
                                      <v-row class="pb-6">
                                        <v-col cols="12" class="text-center">
                                          <span>Academic Certificate</span>
                                        </v-col>
                                        <v-col cols="12" class="text-center">
                                          <v-btn
                                            fab
                                            color="primary"
                                            @click="showFullImage(hover)"
                                          >
                                            <v-icon> mdi-magnify-plus </v-icon>
                                          </v-btn>
                                        </v-col>
                                      </v-row>
                                    </v-overlay>
                                  </v-fade-transition>
                                </v-card>
                              </template>
                            </v-hover>
                          </v-col>
                        </v-row>
                        <v-dialog v-model="imageDialog">
                          <v-container>
                            <v-row>
                              <v-spacer></v-spacer>
                              <v-col class="mr-n12" sm="1">
                                <v-icon dark @click="toggleImageDialog">
                                  mdi-close
                                </v-icon>
                              </v-col>
                            </v-row>
                            <v-img
                              height="82vh"
                              src="@/assets/1-crop.jpg"
                              contain
                              alt="long photo"
                            ></v-img>
                          </v-container>
                        </v-dialog>
                      </v-card-text>
                    </v-card>
                  </v-tab-item>
                </v-tabs>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn text @click="dialog.value = false">Submit</v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>

<script>
// import axios from "axios";

// enums
const gender = ["M", "F"];
const religion = [
  "Christianity",
  "Islam",
  "Buddhism",
  "Hinduism",
  "Judaism",
  "Other",
];
const psychologicalStatus = [
  "isolated",
  "stressed",
  "unsociable",
  "overlysociable",
  "normal",
];
const enrollmentStatus = ["enrolled", "unenrolled", "droppedout"];
const type = ["private", "public", "N_A"];
const level = [
  "religiousEducation",
  "preSchool",
  "gradeSchool",
  "underGraduate",
  "postGraduate",
  "N_A",
];
const vitalStatus = ["alive", "passed"];
const maritalStatus = ["married", "widow", "N_A"];
const nationality = [
  "Djiboutian",
  "Ethiopian",
  "Eritrean",
  "Kenyan",
  "Somali",
  "South_Sudanese",
  "Sudanese",
];
const relationToOrphan = [
  "mother",
  "grandmother",
  "grandfather",
  "sister",
  "brother",
  "uncle",
  "aunt",
  "cousin",
  "niece",
  "nephew",
  "legalGuardian",
];

export default {
  props: {
    details: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      orphanSelectOptions: {
        genderOptions: gender,
        orphanReligionOptions: religion,
        orphanPsychologicalStatusOptions: psychologicalStatus,
        orphanEducationEnrollmentStatusOptions: enrollmentStatus,
        orphanEducationTypeOptions: type,
        orphanEducationLevelOptions: level,
        orphanMotherVitalStatusOptions: vitalStatus,
        orphanMotherMaritalStatusOptions: maritalStatus,
        orphanGuardianNationalityOptions: nationality,
        orphanGuardianRelationToOrphanOptions: relationToOrphan,
      },
      orphanSelectedOption: {
        orphanGender: "",
        orphanReligion: "",
        orphanPsychologicalStatus: "",
        orphanEducationEnrollmentStatus: "",
        orphanEducationType: "",
        orphanEducationLevel: "",
        orphanMotherVitalStatus: "",
        orphanMotherMaritalStatus: "",
        orphanGuardianGender: "",
        orphanGuardianNationality: "",
        orphanGuardianRelationToOrphan: "",
      },
      orphanEditableFields: {
        orphanFirstName: "",
        orphanFatherFirstName: "",
        orphanFatherLastName: "",
        orphanGender: "",
        orphanPlaceOfBirth: "",
        orphanReligion: "",
        orphanSpokenLanguages: "",
        orphanPsychologicalStatus: "",
        orphanHealthDescription: "",
        orphanEducationEnrollmentStatus: "",
        orphanEducationType: "",
        orphanEducationLevel: "",
        orphanEducationYear: "",
        orphanEducationSchoolName: "",
        orphanEducationReason: "",
        orphanHobbies: "",
        orphanFatherCauseOfDeath: "",
        orphanMotherFirstName: "",
        orphanMotherMiddleName: "",
        orphanMotherLastName: "",
        orphanMotherVitalStatus: "",
        orphanMotherMaritalStatus: "",
        orphanMotherMobileNumber: "",
        orphanMotherCauseOfDeath: "",
        orphanHouse_propertyHousingSituation: "",
        orphanHouse_propertyOtherProperty: "",
        orphanGuardianFirstName: "",
        orphanGuardianMiddleName: "",
        orphanGuardianLastName: "",
        orphanGuardianGender: "",
        orphanGuardianEmail: "",
        orphanGuradianMobileNumber: "",
        orphanGuardianRelationToOrphan: "",
        orphanGuardianNationality: "",
        orphanGuardianTelephoneNumber: "",
        orphanGuardianJobTitle: "",
      },
      rules: {
        educationGrade: (value) => {
          if (
            this.orphanEditableFields.orphanEducationLevel ===
              "Religious Education" &&
            value > 0 &&
            value < 4
          )
            return true;
          else if (
            this.orphanEditableFields.orphanEducationLevel === "Preschool" &&
            value > 0 &&
            value < 4
          )
            return true;
          else if (
            this.orphanEditableFields.orphanEducationLevel ===
              "Primary/Elementary" &&
            value > 0 &&
            value < 7
          )
            return true;
          else if (
            this.orphanEditableFields.orphanEducationLevel === "Junior" &&
            value > 6 &&
            value < 9
          )
            return true;
          else if (
            this.orphanEditableFields.orphanEducationLevel === "Highschool" &&
            value > 8 &&
            value < 13
          )
            return true;
          else if (
            this.orphanEditableFields.orphanEducationLevel ===
              "Under Graduate" &&
            value > 0 &&
            value < 11
          )
            return true;
          else if (
            this.orphanEditableFields.orphanEducationLevel ===
              "Post Graduate" &&
            value > 0 &&
            value < 11
          )
            return true;
          else if (
            this.orphanEditableFields.orphanEducationLevel === "N_A" &&
            value === 0
          )
            return true;
          else return "Invalid Grade/Year with respect to Educational Level";
        },
      },
      notEditable: true,
      detailDialog: false,
      dialog: false,
      orphan: null,
      longPhotoDialog: false,
      imageDialog: false,
      educationalRecordHeaders: [
        { text: "Id", value: "id" },
        { text: "Year Division", value: "yearDivision" },
      ],
      educationalRecordItems: [],
    };
  },
  created() {
    this.initialize();
    this.populateFields();
    this.editableFormatter();
  },
  mounted() {},
  watch: {},
  methods: {
    initialize() {
      this.orphan = this.details;
      // console.log("details", this.details);
    },
    populateFields() {
      this.orphanEditableFields.orphanFirstName = this.orphan.firstName;
      this.orphanEditableFields.orphanFatherFirstName = this.orphan.father.firstName;
      this.orphanEditableFields.orphanFatherLastName = this.orphan.father.lastName;
      this.orphanEditableFields.orphanGender = this.orphan.gender;
      this.orphanEditableFields.orphanPlaceOfBirth = this.orphan.placeOfBirth;
      this.orphanEditableFields.orphanReligion = this.orphan.religion;
      this.orphanEditableFields.orphanSpokenLanguages = this.orphan.spokenLanguages;
      this.orphanEditableFields.orphanPsychologicalStatus = this.orphan.psychologicalStatus;
      this.orphanEditableFields.orphanHealthDescription = this.orphan.healthDescription;
      this.orphanEditableFields.orphanEducationEnrollmentStatus = this.orphan.education?.enrollmentStatus;
      this.orphanEditableFields.orphanEducationType = this.orphan.education?.typeOfSchool;
      this.orphanEditableFields.orphanEducationLevel = this.orphan.education?.level;
      this.orphanEditableFields.orphanEducationYear = this.orphan.education?.year;
      this.orphanEditableFields.orphanEducationSchoolName = this.orphan.education?.schoolName;
      this.orphanEditableFields.orphanEducationReason = this.orphan.education?.reason;
      this.orphanEditableFields.orphanHobbies = this.orphan.hobbies;
      this.orphanEditableFields.orphanFatherCauseOfDeath = this.orphan.father.causeOfDeath;
      this.orphanEditableFields.orphanMotherFirstName = this.orphan.mother?.firstName;
      this.orphanEditableFields.orphanMotherMiddleName = this.orphan.mother?.middleName;
      this.orphanEditableFields.orphanMotherLastName = this.orphan.mother?.lastName;
      this.orphanEditableFields.orphanMotherVitalStatus = this.orphan.mother?.vitalStatus;
      this.orphanEditableFields.orphanMotherMaritalStatus = this.orphan.mother?.maritalStatus;
      this.orphanEditableFields.orphanMotherMobileNumber = this.orphan.mother?.mobileNumber;
      this.orphanEditableFields.orphanMotherCauseOfDeath = this.orphan.mother?.causeOfDeath;
      this.orphanEditableFields.orphanHouse_propertyHousingSituation = this.orphan.house_property?.housingSituation;
      this.orphanEditableFields.orphanHouse_propertyOtherProperty = this.orphan.house_property?.otherProperty;
      this.orphanEditableFields.orphanGuardianFirstName = this.orphan.guardian?.firstName;
      this.orphanEditableFields.orphanGuardianMiddleName = this.orphan.guardian?.middleName;
      this.orphanEditableFields.orphanGuardianLastName = this.orphan.guardian?.lastName;
      this.orphanEditableFields.orphanGuardianGender = this.orphan.guardian?.gender;
      this.orphanEditableFields.orphanGuardianEmail = this.orphan.guardian?.email;
      this.orphanEditableFields.orphanGuardianMobileNumber = this.orphan.guardian?.mobileNumber;
      this.orphanEditableFields.orphanGuardianRelationToOrphan = this.orphan.guardian?.relationToOrphan;
      this.orphanEditableFields.orphanGuardianNationality = this.orphan.guardian?.nationality;
      this.orphanEditableFields.orphanGuardianTelephoneNumber = this.orphan.guardian?.telephoneNumber;
      this.orphanEditableFields.orphanGuardianJobTitle = this.orphan.guardian?.jobTitle;
    },
    toggleLongPhotoDialog() {
      this.longPhotoDialog = !this.longPhotoDialog;
    },
    editProfile() {
      this.notEditable = !this.notEditable;
      console.log("orphanSelectedOption", this.orphanSelectedOption);
      // $$ the next couple of lines are used to show the editable field on the select when being edited
      // if the fields are editable
      if (!this.notEditable) {
        this.orphanSelectedOption.orphanGender = this.orphan.gender;
        this.orphanSelectedOption.orphanReligion = this.orphan.religion;
        this.orphanSelectedOption.orphanPsychologicalStatus = this.orphan.psychologicalStatus;
        this.orphanSelectedOption.orphanEducationEnrollmentStatus = this.orphan.education.enrollmentStatus;
        this.orphanSelectedOption.orphanEducationType = this.orphan.education.typeOfSchool;
        this.orphanSelectedOption.orphanMotherVitalStatus = this.orphan.mother.vitalStatus;
        this.orphanSelectedOption.orphanMotherMaritalStatus = this.orphan.mother.maritalStatus;
        this.orphanSelectedOption.orphanGuardianGender = this.orphan.guardian.gender;
        this.orphanSelectedOption.orphanGuardianRelationToOrphan = this.orphan.guardian.relationToOrphan;
        this.orphanSelectedOption.orphanGuardianNationality = this.orphan.guardian.nationality;
        console.log("Editable");
      } else {
        this.editOrphan(this.orphan, this.orphanSelectedOption);
        console.log(this.orphan);
      }
      this.educationLevelFormatter();

      console.log("Edit");
      console.log("orphanEditableFields", this.orphanEditableFields);
    },
    orphanIdGenerator() {
      let orphanId = "";
      let splitName = this.orphan.village.name.trim().split(" ");
      if (splitName.length === 1) {
        orphanId =
          splitName[0].slice(0, 1).toUpperCase() +
          splitName[0].slice(splitName[0].length - 1).toUpperCase();
      } else {
        for (const namePart of splitName) {
          orphanId += namePart.slice(0, 1).toUpperCase();
        }
      }
      orphanId += "-" + this.orphan.id;
      return orphanId;
    },
    dateGenerator(date) {
      return new Date(Date.parse(date.toString())).toDateString();
    },
    genderGenerator(genderAbbr) {
      return genderAbbr === "M" ? "Male" : "Femail";
    },
    showFullImage() {
      this.imageDialog = true;
    },
    toggleImageDialog() {
      this.imageDialog = !this.imageDialog;
    },
    editableFormatter() {
      this.orphanSelectOptions.genderOptions = this.orphanSelectOptions.genderOptions.map(
        (val) => {
          let obj = {
            text: "",
            value: "",
          };
          obj.text = val === "M" ? "Male" : "Female";
          obj.value = val;
          return obj;
        }
      );

      // removing gradeSchool and adding primary, junior and hightschool
      this.orphanSelectOptions.orphanEducationLevelOptions.splice(
        this.orphanSelectOptions.orphanEducationLevelOptions.indexOf(
          "gradeSchool"
        ),
        1,
        "Primary/Elementary",
        "Junior",
        "Highschool"
      );

      this.orphanSelectOptions.orphanEducationLevelOptions = this.orphanSelectOptions.orphanEducationLevelOptions.map(
        (val) => {
          let obj = {
            text: "",
            value: "",
          };
          const regex = /[A-Z]/g;
          let idx = val.search(regex);
          if (val === "N_A") obj.text = val;
          else if (
            val === "Primary/Elementary" ||
            val === "Junior" ||
            val === "Highschool"
          )
            obj.text = val;
          else if (val === "preSchool")
            obj.text =
              val.slice(0, 1).toUpperCase() + val.slice(1).toLowerCase();
          else
            obj.text =
              val.slice(0, 1).toUpperCase() +
              val.slice(1, idx) +
              " " +
              val.slice(idx);
          obj.value = val;
          return obj;
        }
      );
      this.educationLevelFormatter();

      this.orphanSelectOptions.orphanEducationTypeOptions = this.orphanSelectOptions.orphanEducationTypeOptions.map(
        (val) => {
          let obj = {
            text: "",
            value: "",
          };
          if (val === "N_A") obj.text = val;
          obj.text = val.slice(0, 1).toUpperCase() + val.slice(1);
          obj.value = val;

          return obj;
        }
      );

      // console.log(
      //   "orphanLevelOptions",
      //   this.orphanSelectOptions.orphanEducationLevelOptions
      // );
    },
    // formats education level
    educationLevelFormatter() {
      if (this.orphan.education?.level === "religiousEducation") {
        this.orphanEditableFields.orphanEducationLevel = "Religious Education";
        this.orphanSelectedOption.orphanEducationLevel = "Religious Education";
      } else if (this.orphan.education?.level === "preSchool") {
        this.orphanEditableFields.orphanEducationLevel = "Preschool";
        this.orphanSelectedOption.orphanEducationLevel = "Preschool";
      } else if (this.orphan.education?.level === "gradeSchool") {
        if (this.orphan.education?.year > 0 && this.orphan.education?.year < 7) {
          this.orphanEditableFields.orphanEducationLevel = "Primary/Elementary";
          this.orphanSelectedOption.orphanEducationLevel = "Primary/Elementary";
        } else if (
          this.orphan.education?.year > 6 &&
          this.orphan.education?.year < 9
        ) {
          this.orphanEditableFields.orphanEducationLevel = "Junior";
          this.orphanSelectedOption.orphanEducationLevel = "Junior";
        } else if (
          this.orphan.education?.year > 8 &&
          this.orphan.education?.year < 13
        ) {
          this.orphanEditableFields.orphanEducationLevel = "Highschool";
          this.orphanSelectedOption.orphanEducationLevel = "Highschool";
        } else {
          this.orphanEditableFields.orphanEducationLevel = "N_A";
          this.orphanSelectedOption.orphanEducationLevel = "N_A";
        }
      } else if (this.orphan.education?.level === "underGraduate") {
        this.orphanEditableFields.orphanEducationLevel = "Under Graduate";
        this.orphanSelectedOption.orphanEducationLevel = "Under Graduate";
      } else if (this.orphan.education?.level === "postGraduate") {
        this.orphanEditableFields.orphanEducationLevel = "Post Graduate";
        this.orphanSelectedOption.orphanEducationLevel = "Post Graduate";
      } else {
        this.orphanEditableFields.orphanEducationLevel = this.orphan.education?.level;
        this.orphanSelectedOption.orphanEducationLevel = this.orphan.education?.level;
      }
    },
    editOrphan(baseObject, editorObject) {
      for (let editorName in editorObject) {
        const capitalCheckerRegex = /[A-Z]/;
        let idx = editorName.search(capitalCheckerRegex);
        let property = "";

        property = editorName
          .slice(idx, idx + 1)
          .toLowerCase()
          .concat(editorName.slice(idx + 1));

        if (property === null || property === "") {
          console.log(`Orphan doesn't have "${property}" property`);
        } else if (Object.hasOwnProperty.call(baseObject, property)) {
          baseObject[property] = editorObject[editorName];
        } else {
          idx = property.search(capitalCheckerRegex);
          let parentProperty = property.slice(0, idx);
          let childProperty = property
            .slice(idx, idx + 1)
            .toLowerCase()
            .concat(property.slice(idx + 1));
          if (Object.hasOwnProperty.call(baseObject, parentProperty)) {
            const childObject = baseObject[parentProperty];
            if (Object.hasOwnProperty.call(childObject, childProperty)) {
              childObject[childProperty] = editorObject[editorName];
            } else
              console.error(
                `orphan.${parentProperty}.${childProperty} doesn't exist`
              );
          } else console.error(`orphan.${parentProperty} doesn't exist`);
          /**
           * OTHER WAY OF DOING IT OR I THOUGHT IT WOULD
           */
          // if(baseObject.hasOwnProperty(parentProperty)) {
          //   if(baseObject[parentProperty].hasOwnProperty(childProperty))
          //     baseObject[parentProperty][childProperty] = editorObject[editorName];
          //   else console.log(`orphan does't have "${parentProperty}.${childProperty}" property`);

          // } else console.log(`orphan does't have "${parentProperty}" property`);
        }
      }
    },
  },
};
</script>
