<template>
  <div>
    <v-card link max-width="15rem" @click="dialog = true">
      <v-card-title class="headline justify-center">
        Family Info
      </v-card-title>
    </v-card>
    <v-dialog v-model="dialog" max-width="60em">
      <v-card>
        <!-- <v-card-title>
          <span class="headline">{{ formTitle }}</span>
        </v-card-title> -->
        <!-- the form part; the fields part-->
        <v-card-text>
          <v-form ref="familyForm" v-model="validFamilyForm" lazy-validation>
            <v-container>
              <v-row>
                <!-- Father Section -->
                <template>
                  <v-col sm="12" class="mb-n2">
                    <div class="title mt-3 mb-n5">Father</div>
                  </v-col>
                  <!-- Father Date of Birth field -->
                  <v-col cols="12" sm="6" md="3">
                    <v-responsive max-width="" class="">
                      <v-menu
                        ref="fatherDateOfBirthMenu"
                        v-model="fatherDateOfBirthMenu"
                        :close-on-content-click="false"
                        transition="scale-transition"
                        offset-y
                        min-width="auto"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field
                            v-model="orphan.father.dateOfBirth"
                            label="Date of Birth"
                            prepend-icon="mdi-calendar"
                            readonly
                            v-bind="attrs"
                            v-on="on"
                            :rules="[rules.required]"
                          ></v-text-field>
                        </template>
                        <v-date-picker
                          ref="fatherDateOfBirthPicker"
                          v-model="orphan.father.dateOfBirth"
                          no-title
                          scrollable
                          :max="new Date().toISOString().substr(0, 10)"
                          min="1950-01-01"
                          @change="fatherDateOfBirthSave"
                        >
                        </v-date-picker>
                      </v-menu>
                    </v-responsive>
                  </v-col>
                  <!-- Father Date of Death field -->
                  <v-col cols="12" sm="6" md="3">
                    <v-responsive max-width="" class="">
                      <v-menu
                        ref="fatherDateOfDeathMenu"
                        v-model="fatherDateOfDeathMenu"
                        :close-on-content-click="false"
                        transition="scale-transition"
                        offset-y
                        min-width="auto"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field
                            v-model="orphan.father.dateOfDeath"
                            label="Date of Death"
                            prepend-icon="mdi-calendar"
                            readonly
                            v-bind="attrs"
                            v-on="on"
                            :rules="[rules.required]"
                          ></v-text-field>
                        </template>
                        <v-date-picker
                          ref="fatherDateOfDeathPicker"
                          v-model="orphan.father.dateOfDeath"
                          no-title
                          scrollable
                          :max="new Date().toISOString().substr(0, 10)"
                          min="1950-01-01"
                          @change="fatherDateOfDeathSave"
                        >
                        </v-date-picker>
                      </v-menu>
                    </v-responsive>
                  </v-col>
                  <!-- TODO # change this field to select when provided -->
                  <!-- Father Cause of Death field-->
                  <v-col cols="12" sm="6" md="6">
                    <v-responsive max-width="" class="">
                      <v-text-field
                        v-model="orphan.father.causeOfDeath"
                        label="Cause of Death"
                        :rules="[rules.required]"
                      >
                      </v-text-field>
                    </v-responsive>
                  </v-col>
                </template>
                <!-- Mother Section -->
                <template>
                  <v-col sm="12" class="mt-n4 mb-n2">
                    <div class="title mt-n3 mb-n5">Mother</div>
                  </v-col>
                  <!-- Mother First Name field-->
                  <v-col cols="12" sm="6" md="4">
                    <v-responsive max-width="" class="">
                      <v-text-field
                        v-model="orphan.mother.firstName"
                        label="First Name"
                        :rules="[rules.required, rules.name]"
                      >
                      </v-text-field>
                    </v-responsive>
                  </v-col>
                  <!-- Mather Middle Name field-->
                  <v-col cols="12" sm="6" md="4">
                    <v-responsive max-width="" class="">
                      <v-text-field
                        v-model="orphan.mother.middleName"
                        :rules="[rules.required, rules.name]"
                        label="Middle Name"
                      >
                      </v-text-field>
                    </v-responsive>
                  </v-col>
                  <!-- Mother Last Name field -->
                  <v-col cols="12" sm="6" md="4">
                    <v-responsive max-width="" class="">
                      <v-text-field
                        v-model="orphan.mother.lastName"
                        :rules="[rules.required, rules.name]"
                        label="Last Name"
                      >
                      </v-text-field>
                    </v-responsive>
                  </v-col>
                  <!-- Mother Date of Birth field -->
                  <v-col cols="12" sm="6" md="4" class="mt-n6">
                    <v-responsive max-width="" class="">
                      <v-menu
                        ref="motherDateOfBirthMenu"
                        v-model="motherDateOfBirthMenu"
                        :close-on-content-click="false"
                        transition="scale-transition"
                        offset-y
                        min-width="auto"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field
                            v-model="orphan.mother.dateOfBirth"
                            label="Date of Birth"
                            prepend-icon="mdi-calendar"
                            readonly
                            v-bind="attrs"
                            v-on="on"
                            :rules="[rules.required]"
                          ></v-text-field>
                        </template>
                        <v-date-picker
                          ref="motherDateOfBirthPicker"
                          v-model="orphan.mother.dateOfBirth"
                          no-title
                          scrollable
                          :max="new Date().toISOString().substr(0, 10)"
                          min="1950-01-01"
                          @change="motherDateOfBirthSave"
                        >
                        </v-date-picker>
                      </v-menu>
                    </v-responsive>
                  </v-col>
                  <!-- Mother Vital Status field -->
                  <v-col cols="12" sm="6" md="4" class="mt-n6">
                    <v-responsive max-width="" class="">
                      <v-select
                        v-model="orphan.mother.vitalStatus"
                        :items="motherVitalStatusOptions"
                        :menu-props="{
                          bottom: true,
                          offsetY: true,
                        }"
                        :rules="[rules.required]"
                        label="Vital Status"
                      ></v-select>
                    </v-responsive>
                  </v-col>
                  <!-- Mother Martial Status field -->
                  <template v-if="orphan.mother.vitalStatus === 'Alive'">
                    <v-col cols="12" sm="6" md="4" class="mt-n6">
                      <v-responsive max-width="" class="">
                        <v-select
                          v-model="orphan.mother.maritalStatus"
                          :items="motherMaritalStatusOptions"
                          :menu-props="{
                            bottom: true,
                            offsetY: true,
                          }"
                          :rules="[rules.required]"
                          label="Marital Status"
                        ></v-select>
                      </v-responsive>
                    </v-col>
                  </template>
                  <!-- Mother Date of Death field -->
                  <template
                    v-else-if="orphan.mother.vitalStatus === 'Passed Away'"
                  >
                    <v-col cols="12" sm="6" md="4" class="mt-n6">
                      <v-responsive max-width="" class="">
                        <v-menu
                          ref="motherDateOfDeathMenu"
                          v-model="motherDateOfDeathMenu"
                          :close-on-content-click="false"
                          transition="scale-transition"
                          offset-y
                          min-width="auto"
                        >
                          <template v-slot:activator="{ on, attrs }">
                            <v-text-field
                              v-model="orphan.mother.dateOfDeath"
                              label="Date of Death"
                              prepend-icon="mdi-calendar"
                              readonly
                              v-bind="attrs"
                              v-on="on"
                              :rules="[rules.required]"
                            ></v-text-field>
                          </template>
                          <v-date-picker
                            ref="motherDateOfDeathPicker"
                            v-model="orphan.mother.dateOfDeath"
                            no-title
                            scrollable
                            :max="new Date().toISOString().substr(0, 10)"
                            min="1950-01-01"
                            @change="motherDateOfDeathSave"
                          >
                          </v-date-picker>
                        </v-menu>
                      </v-responsive>
                    </v-col>
                  </template>
                </template>
                <!-- House and Property Info -->
                <template class="mt-n4">
                  <v-col sm="12">
                    <div class="title mt-n3 mb-n5">Housing and Property</div>
                  </v-col>
                  <!-- TODO # change this field to select -->
                  <!-- Housing Situation field -->
                  <v-col cols="12" sm="6" md="7" class="mb-n3">
                    <v-select
                      v-model="orphan.House_property.housingSituation"
                      :items="orphanHousingSituationOptions"
                      :menu-props="{
                        bottom: true,
                        offsetY: true,
                      }"
                      :rules="[rules.required]"
                      label="Housing Situation"
                    ></v-select>
                    <!-- <v-responsive max-width="" class="">
                      <v-combobox
                        v-model="orphanHousingSituationSelect"
                        :items="orphanHousingSituationOptions"
                        :menu-props="{
                          bottom: true,
                          offsetY: true,
                        }"
                        label="Housing Situation"
                        multiple
                        chips
                      >
                        <template
                          v-slot:selection="{ attrs, item, select, selected }"
                        >
                          <v-chip
                            v-bind="attrs"
                            :input-value="selected"
                            close
                            @click:close="
                              removeOrphanHousingSituationSelect(
                                attrs,
                                item,
                                select,
                                selected
                              )
                            "
                          >
                            <strong>{{ item }}</strong> </v-chip
                          >,
                        </template>
                      </v-combobox>
                    </v-responsive> -->
                  </v-col>
                  <!-- Other Properties -->
                  <v-col cols="12" sm="12" md="12" class="mt-n5">
                    <v-responsive max-width="" class="">
                      <v-textarea
                        v-model="orphan.House_property.otherProperty"
                        label="Other Properties"
                        auto-grow
                        :rules="[rules.required]"
                        rows="1"
                      ></v-textarea>
                    </v-responsive>
                  </v-col>
                </template>
              </v-row>
            </v-container>
          </v-form>
        </v-card-text>
        <v-divider class="mt-3"></v-divider>
        <!-- the action part; the buttons part -->
        <v-card-actions>
          <v-btn color="red darken-1" text @click="familyDialogCancel">
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
                  @click="familyDialogReset"
                  v-on="on"
                >
                  <v-icon>mdi-refresh</v-icon>
                </v-btn>
              </template>
              <span>Refresh form</span>
            </v-tooltip>
          </v-slide-x-reverse-transition>
          <v-btn color="blue darken-1" text @click="familyDialogNext">
            Next
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import axios from "axios";

export default {
  props: ["updatedOrphan"],
  data() {
    return {
      // dialog
      dialog: false,
      validFamilyForm: null,
      formHasErrors: null,
      orphan: {
        father: {
          dateOfBirth: null,
          dateOfDeath: null,
          causeOfDeath: null,
        },
        mother: {
          firstName: null,
          middleName: null,
          lastName: null,
          dateOfBirth: null,
          vitalStatus: null,
          maritalStatus: null,
          dateOfDeath: null,
        },
        House_property: {
          housingSituation: null,
          otherProperty: null,
        },
      },
      rules: {
        required: (value) => !!value || "Required.",
        name: (value) => {
          const namePattern = /(^[A-z][A-Z-a-z/'.,/]+)[A-z]\s*$/g;
          return namePattern.test(value) || "Invalid name";
        },
      },
      fatherDateOfBirthMenu: false,
      fatherDateOfDeathMenu: false,
      motherDateOfBirthMenu: false,
      motherDateOfDeathMenu: false,
      motherVitalStatusOptions: ["Alive", "Passed Away"],
      motherMaritalStatusOptions: ["Widow", "Married"],
      orphanHousingSituationOptions: [
        "Privately Owned",
        "Rental",
        "With Relative",
        "Dependent",
      ],
    };
  },
  created() {},
  computed: {},
  watch: {
    // dialog
    fatherDateOfBirthMenu(val) {
      // Changes the active picker from the default "DATE" to "YEAR"
      val &&
        setTimeout(
          () => (this.$refs.fatherDateOfBirthPicker.activePicker = "YEAR")
        );
    },
    fatherDateOfDeathMenu(val) {
      val &&
        setTimeout(
          () => (this.$refs.fatherDateOfDeathPicker.activePicker = "YEAR")
        );
    },
    motherDateOfBirthMenu(val) {
      // Changes the active picker from the default "DATE" to "YEAR"
      val &&
        setTimeout(
          () => (this.$refs.motherDateOfBirthPicker.activePicker = "YEAR")
        );
    },

    motherDateOfDeathMenu(val) {
      // Changes the active picker from the default "DATE" to "YEAR"
      val &&
        setTimeout(
          () => (this.$refs.motherDateOfDeathPicker.activePicker = "YEAR")
        );
    },
    dialog(val) {
      val || this.familyDialogClose();
    },
  },
  methods: {
    // dialog
    fatherDateOfBirthSave(date) {
      // console.log(this.$refs.menu);
      this.$refs.fatherDateOfBirthMenu.save(date);
    },
    fatherDateOfDeathSave(date) {
      // console.log(this.$refs.menu);
      this.$refs.fatherDateOfDeathMenu.save(date);
    },
    motherDateOfBirthSave(date) {
      // console.log(this.$refs.menu);
      this.$refs.motherDateOfBirthMenu.save(date);
    },
    motherDateOfDeathSave(date) {
      // console.log(this.$refs.menu);
      this.$refs.motherDateOfDeathMenu.save(date);
    },
    // combobox methods
    removeOrphanHousingSituationSelect(attrs, item) {
      this.orphanHousingSituationSelect.splice(
        this.orphanHousingSituationSelect.indexOf(item),
        1
      );
      console.log(this.orphanHousingSituationSelect);
      console.log(attrs);
      this.orphanHousingSituationSelect = [
        ...this.orphanHousingSituationSelect,
      ];
    },

    async getOrphanFather(
      firstName,
      lastName,
      dateOfDeath,
      causeOfDeath,
      dateOfBirth,
      deathCertificateUrl
    ) {
      return await axios
        .post("/graphql", {
          query: `mutation createFather(
                    $firstName: String!
                    $lastName: String!
                    $dateOfDeath: DateTime!
                    $causeOfDeath: String!
                    $dateOfBirth: DateTime!
                    $deathCertificateUrl: String!
                  ) {
                    createFather(
                      firstName: $firstName
                      lastName: $lastName
                      dateOfDeath: $dateOfDeath
                      causeOfDeath: $causeOfDeath
                      dateOfBirth: $dateOfBirth
                      deathCertificateUrl: $deathCertificateUrl
                    ) {
                      id
                      firstName
                      lastName
                      deathCertificateUrl
                    }
                  }`,
          variables: {
            firstName: firstName,
            lastName: lastName,
            dateOfDeath: dateOfDeath,
            causeOfDeath: causeOfDeath,
            dateOfBirth: dateOfBirth,
            deathCertificateUrl: deathCertificateUrl,
          },
        })
        .then((res) => res.data?.data?.createFather)
        .catch((err) => console.warn(err));
    },

    async getOrphanMother(
      firstName,
      middleName,
      lastName,
      vitalStatus,
      dateOfBirth,
      dateOfDeath,
      causeOfDeath,
      maritalStatus,
      mobileNumber,
      monthlyExpense
    ) {
      return await axios
        .post("/graphql", {
          query: `mutation createMother(
                  $firstName: String!
                  $middleName: String!
                  $lastName: String!
                  $vitalStatus: motherVitalStatus!
                  $dateOfBirth: DateTime!
                  $dateOfDeath: DateTime
                  $causeOfDeath: String
                  $maritalStatus: motherMaritalStatus
                  $mobileNumber: String!
                  $monthlyExpense: Float!
                ) {
                  createMother(
                    firstName: $firstName
                    middleName: $middleName
                    lastName: $lastName
                    vitalStatus: $vitalStatus
                    dateOfBirth: $dateOfBirth
                    dateOfDeath: $dateOfDeath
                    causeOfDeath: $causeOfDeath
                    maritalStatus: $maritalStatus
                    mobileNumber: $mobileNumber
                    monthlyExpense: $monthlyExpense
                  ) {
                    id
                    firstName
                    vitalStatus
                  }
                }`,
          variables: {
            firstName: firstName,
            middleName: middleName,
            lastName: lastName,
            vitalStatus: vitalStatus,
            dateOfBirth: dateOfBirth,
            dateOfDeath: dateOfDeath || null,
            causeOfDeath: causeOfDeath || null,
            maritalStatus: maritalStatus || null,
            mobileNumber: mobileNumber,
            monthlyExpense: monthlyExpense,
          },
        })
        .then((res) => res.data.data.createMother)
        .catch((err) => console.warn(err));
    },

    async getOrphanEducation(
      enrollmentStatus,
      schoolName,
      typeOfSchool,
      year,
      level,
      reason
    ) {
      return await axios
        .post("/graphql", {
          query: `mutation createEducation(
                  $enrollmentStatus: educationEnrollmentStatus!
                  $schoolName: String
                  $typeOfSchool: educationTypeOfSchool
                  $year: String
                  $level: educationLevel
                  $reason: String
                ) {
                  createEducation(
                    enrollmentStatus: $enrollmentStatus
                    schoolName: $schoolName
                    typeOfSchool: $typeOfSchool
                    year: $year
                    level: $level
                    reason: $reason
                  ) {
                    id
                    enrollmentStatus
                    reason
                  }
                }`,
          variables: {
            enrollmentStatus: enrollmentStatus,
            schoolName: schoolName || null,
            typeOfSchool: typeOfSchool || "N_A",
            year: String(year) || null,
            level: level || "N_A",
            reason: reason || null,
          },
        })
        .then((res) => res.data.data.createEducation)
        .catch((err) => console.warn(err));
    },

    async getOrphanGuardian(
      firstName,
      middleName,
      lastName,
      dateOfBirth,
      gender,
      relationToOrphan,
      nationality,
      mobileNumber,
      telephoneNumber,
      email,
      guardianIDCardUrl,
      guardianConfirmationLetterUrl,
      guardianLegalConfirmationLetterUrl
    ) {
      return await axios
        .post("/graphql", {
          query: `mutation createGuardian(
                  $firstName: String!
                  $middleName: String!
                  $lastName: String!
                  $dateOfBirth: DateTime!
                  $gender: guardianGender!
                  $relationToOrphan: guardianRelationToOrphan!
                  $nationality: guardianNationality!
                  $mobileNumber: String!
                  $telephoneNumber: String
                  $email: String!
                  $guardianIDCardUrl: String!
                  $guardianConfirmationLetterUrl: String!
                  $guardianLegalConfirmationLetterUrl: String!
                ) {
                  createGuardian(
                    firstName: $firstName
                    middleName: $middleName
                    lastName: $lastName
                    dateOfBirth: $dateOfBirth
                    gender: $gender
                    relationToOrphan: $relationToOrphan
                    nationality: $nationality
                    mobileNumber: $mobileNumber
                    telephoneNumber: $telephoneNumber
                    email: $email
                    guardianIDCardUrl: $guardianIDCardUrl
                    guardianConfirmationLetterUrl: $guardianConfirmationLetterUrl
                    guardianLegalConfirmationLetterUrl: $guardianLegalConfirmationLetterUrl
                  ) {
                    id
                    firstName
                    email
                  }
                }`,
          variables: {
            firstName: firstName,
            middleName: middleName,
            lastName: lastName,
            dateOfBirth: dateOfBirth,
            gender: gender,
            relationToOrphan: relationToOrphan,
            nationality: nationality,
            mobileNumber: mobileNumber,
            telephoneNumber: telephoneNumber,
            email: email,
            guardianIDCardUrl: guardianIDCardUrl,
            guardianConfirmationLetterUrl: guardianConfirmationLetterUrl,
            guardianLegalConfirmationLetterUrl: guardianLegalConfirmationLetterUrl,
          },
        })
        .then((res) => res.data.data.createGuardian)
        .catch((err) => console.warn(err));
    },

    async getHouseProperty(housingSituation, otherProperty) {
      return axios
        .post("/graphql", {
          query: `mutation createHouse_property(
                  $housingSituation: String!
                  $otherProperty: String
                ) {
                  createHouse_property(
                    housingSituation: $housingSituation
                    otherProperty: $otherProperty
                  ) {
                    id
                    housingSituation
                  }
                }`,
          variables: {
            housingSituation: housingSituation,
            otherProperty: otherProperty,
          },
        })
        .then((res) => res.data.data.createHouse_property)
        .catch((err) => console.warn(err));
    },

    async registerOrphan(
      firstName,
      gender,
      placeOfBirth,
      dateOfBirth,
      spokenLanguages,
      hobbies,
      religion,
      healthDescription,
      psychologicalStatus,
      idCardUrl,
      passportUrl,
      birthCertificateUrl,
      fatherId,
      educationId,
      guardianId,
      motherId,
      house_propertyId
    ) {
      return await axios
        .post("/graphql", {
          query: `mutation createOrphan(
                    $firstName: String!
                    $gender: orphanGender!
                    $placeOfBirth: String!
                    $dateOfBirth: DateTime!
                    $spokenLanguages: String
                    $hobbies: String
                    $religion: orphanReligion
                    $healthDescription: String!
                    $psychologicalStatus: orphanPsychologicalStatus
                    $idCardUrl: String
                    $passportUrl: String
                    $birthCertificateUrl: String!
                    $fatherId: ID
                    $motherId: ID
                    $educationId: ID
                    $guardianId: ID
                    $house_propertyId: ID
                  ) {
                    createOrphan(
                      firstName: $firstName
                      gender: $gender
                      placeOfBirth: $placeOfBirth
                      dateOfBirth: $dateOfBirth
                      spokenLanguages: $spokenLanguages
                      hobbies: $hobbies
                      religion: $religion
                      healthDescription: $healthDescription
                      psychologicalStatus: $psychologicalStatus
                      idCardUrl: $idCardUrl
                      passportUrl: $passportUrl
                      birthCertificateUrl: $birthCertificateUrl
                      fatherId: $fatherId
                      motherId: $motherId
                      educationId: $educationId
                      guardianId: $guardianId
                      house_propertyId: $house_propertyId
                    ) {
                      id
                      firstName
                      gender
                      placeOfBirth
                      dateOfBirth
                      spokenLanguages
                      hobbies
                      religion
                      healthDescription
                      psychologicalStatus
                      father {
                        id
                        firstName
                        lastName
                        dateOfBirth
                        dateOfDeath
                        causeOfDeath
                      }
                      mother {
                        id
                        firstName
                        middleName
                        lastName
                        vitalStatus
                        dateOfBirth
                      }
                      education {
                        enrollmentStatus
                        schoolName
                        typeOfSchool
                        level
                        year
                      }
                      guardian {
                        firstName
                        middleName
                        lastName
                        gender
                        dateOfBirth
                        relationToOrphan
                        email
                        nationality
                        mobileNumber
                        telephoneNumber
                      }
                      house_property {
                        housingSituation
                        otherProperty
                      }
                    }
                  }`,
          variables: {
            firstName: firstName,
            gender: gender,
            placeOfBirth: placeOfBirth,
            dateOfBirth: dateOfBirth,
            spokenLanguages: spokenLanguages,
            hobbies: hobbies,
            religion: religion,
            healthDescription: healthDescription,
            psychologicalStatus: psychologicalStatus,
            idCardUrl: idCardUrl,
            passportUrl: passportUrl,
            birthCertificateUrl: birthCertificateUrl,
            fatherId: fatherId,
            educationId: educationId,
            guardianId: guardianId,
            motherId: motherId,
            house_propertyId: house_propertyId,
          },
        })
        .then((res) => res.data.data.createOrphan)
        .catch((err) => console.warn(err));
    },

    familyDialogClose() {
      this.dialog = false;

      // this.$nextTick(() => {
      //   this.orphanItem = Object.assign({}, this.defaultItem);
      //   this.orphanIndex = -1;
      // });
    },

    familyDialogReset() {
      this.formHasErrors = false;
      this.$refs.familyForm.reset();
    },

    familyDialogNext() {
      // if (this.orphanIndex > -1) {
      //   Object.assign(this.orphans[this.orphanIndex], this.orphanItem);
      // } else {
      //   this.orphans.push(this.orphanItem);
      // }
      this.formHasErrors = false;

      if (this.$refs.familyForm.validate()) {
        this.orphan = Object.assign(this.orphan ?? {}, this.updatedOrphan);

        this.orphan.father = Object.assign(
          this.orphan.father ?? {},
          this.updatedOrphan?.father
        );

        // this.orphan.mother = Object.assign(
        //   this.orphan.mother ?? {},
        //   this.updatedOrphan?.mother
        // );

        // this.orphan.House_property = Object.assign(
        //   this.orphan.House_property ?? {},
        //   this.updatedOrphan?.House_property
        // );

        this.orphan.education = Object.assign(
          this.orphan.education ?? {},
          this.updatedOrphan?.education
        );

        this.orphan.guardian = Object.assign(
          this.orphan.guardian ?? {},
          this.updatedOrphan?.guardian
        );

        const father = this.getOrphanFather(
          this.orphan.father.firstName,
          this.orphan.father.lastName,
          new Date(this.orphan.father.dateOfDeath).toISOString(),
          this.orphan.father.causeOfDeath,
          new Date(this.orphan.father.dateOfBirth).toISOString(),
          "deathCertificateUrlPlaceholder"
        );

        const education = this.getOrphanEducation(
          this.orphan.education.enrollmentStatus,
          this.orphan.education.schoolName,
          this.orphan.education.typeOfSchool,
          this.orphan.education.year,
          this.orphan.education.level,
          this.orphan.education.reason
        );

        this.orphan.mother.vitalStatus = this.orphan.mother.vitalStatus
          .split(" ")[0]
          .toString()
          .toLowerCase();
        this.orphan.mother.maritalStatus = this.orphan.mother.maritalStatus.toLowerCase();
        this.orphan.mother.dateOfBirth = new Date(
          this.orphan.mother.dateOfBirth
        ).toISOString();
        this.orphan.mother.dateOfDeath = new Date(
          this.orphan.mother.dateOfDeath
        ).toISOString();
        (this.orphan.mother.mobileNumber = "0974671463"),
          (this.orphan.mother.monthlyExpense = parseFloat(987.76));

        const mother = this.getOrphanMother(
          this.orphan.mother.firstName,
          this.orphan.mother.middleName,
          this.orphan.mother.lastName,
          this.orphan.mother.vitalStatus,
          this.orphan.mother.dateOfBirth,
          this.orphan.mother.dateOfDeath,
          this.orphan.mother.causeOfDeath,
          this.orphan.mother.maritalStatus,
          this.orphan.mother.mobileNumber,
          this.orphan.mother.monthlyExpense
        );

        const guardian = this.getOrphanGuardian(
          this.orphan.guardian.firstName,
          this.orphan.guardian.middleName,
          this.orphan.guardian.lastName,
          this.orphan.guardian.dateOfBirth,
          this.orphan.guardian.gender,
          this.orphan.guardian.relationToOrphan,
          this.orphan.guardian.nationality,
          this.orphan.guardian.mobileNumber,
          this.orphan.guardian.telephoneNumber,
          this.orphan.guardian.email,
          "guardianIDCardUrl2",
          "guardianConfirmationLetterUrl2",
          "guardianLegalConfirmationLetterUrl2"
        );

        const houseProperty = this.getHouseProperty(
          this.orphan.House_property.housingSituation,
          this.orphan.House_property.otherProperty
        );

        // let registeredOrphan = undefined;

        father
          .then((fatherRes) => {
            console.log("fatherId", fatherRes.id);
            education
              .then((educationRes) => {
                console.log("educationId", educationRes.id);
                guardian
                  .then((guardianRes) => {
                    console.log("guardianId", guardianRes.id);
                    mother
                      .then((motherRes) => {
                        console.log("motherId", motherRes.id);
                        houseProperty
                          .then((housePropertyRes) => {
                            console.log("housePropertyId", housePropertyRes.id);
                            // registeredOrphan = this.registerOrphan(
                            this.registerOrphan(
                              this.orphan.firstName,
                              this.orphan.gender,
                              this.orphan.placeOfBirth,
                              this.orphan.dateOfBirth,
                              this.orphan.spokenLanguages,
                              this.orphan.hobbies,
                              this.orphan.religion,
                              this.orphan.healthDescription,
                              this.orphan.psychologicalStatus,
                              this.orphan.idCardUrl || "idCardUrl2",
                              this.orphan.passportUrl || "passportUrl2 ",
                              this.orphan.birthCertificateUrl ||
                                "birthCertificateUrl2",
                              fatherRes.id,
                              educationRes.id,
                              guardianRes.id,
                              motherRes.id,
                              housePropertyRes.id
                            ).then(registeredOrphan => {
                              console.log("registeredOrphan", registeredOrphan);
                            })
                          })
                          .catch((err) => console.log(err));
                      })
                      .catch((err) => console.log(err));
                  })
                  .catch((err) => console.log(err));
              })
              .catch((err) => console.log(err));
          })
          .catch((err) => console.log(err));

        this.$emit("familyDone", this.orphan);
        this.familyDialogClose();
      } else if (!this.$refs.familyForm.validate()) {
        this.formHasErrors = true;
      }
    },

    familyDialogCancel() {
      this.familyDialogReset();
      this.familyDialogClose();
    },
  },
};
</script>
