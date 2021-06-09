<template>
  <div>
    <!-- dialog -->
    <div>
      <v-card link max-width="15rem" @click="dialog = true">
        <v-card-title class="headline justify-center">
          Documents
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
              ref="documentForm"
              v-model="validDocumentForm"
              lazy-validation
            >
              <v-container>
                <v-row>
                  <!-- Orphan Documents -->
                  <template>
                    <v-col sm="12">
                      <div class="title mt-3 mb-n5">Orphan Documents</div>
                    </v-col>
                    <!-- Birth Certificate -->
                    <v-col cols="12" sm="6" md="4">
                      <v-file-input
                        v-model="birthCertificateFile"
                        accept="image/*, .pdf"
                        counter
                        chips
                        prepend-icon="mdi-file-document-outline"
                        :rules="[rules.required]"
                        label="Birth Certificate"
                        @change="toggleBirthCertificateInput($event)"
                      >
                        <template v-slot:append>
                          <v-tooltip top>
                            <template v-slot:activator="{ on, attrs }">
                              <v-icon
                                class="ml-auto"
                                v-bind="attrs"
                                v-on="on"
                                @click="toggleBirthCertificateDialog"
                              >
                                mdi-file-eye-outline
                              </v-icon>
                            </template>
                            <span>Preview</span>
                          </v-tooltip>

                          <!-- preview image popup -->
                          <v-dialog v-model="birthCertificateDialog">
                            <v-container>
                              <v-row>
                                <!-- <v-col>what</v-col> -->
                                <v-spacer></v-spacer>
                                <v-col class="mr-n12" sm="1">
                                  <v-icon
                                    dark
                                    @click="toggleBirthCertificateDialog"
                                  >
                                    mdi-close
                                  </v-icon>
                                </v-col>
                              </v-row>

                              <v-img
                                height="82vh"
                                :src="birthCertificateFile"
                                contain
                                alt="birthCertificateimage"
                              ></v-img>
                            </v-container>
                          </v-dialog>
                        </template>
                      </v-file-input>
                    </v-col>
                    <!-- Portrait Photo -->
                    <v-col cols="12" sm="6" md="4">
                      <v-file-input
                        v-model="portraitPhotoFile"
                        accept="image/*, .pdf"
                        counter
                        chips
                        prepend-icon="mdi-camera"
                        label="Portrait Photo"
                        @change="togglePortraitPhotoInput($event)"
                      >
                        <template v-slot:append>
                          <v-tooltip top>
                            <template v-slot:activator="{ on, attrs }">
                              <v-icon
                                class="ml-auto"
                                v-bind="attrs"
                                v-on="on"
                                @click="togglePortraitPhotoDialog"
                              >
                                mdi-file-eye-outline
                              </v-icon>
                            </template>
                            <span>Preview</span>
                          </v-tooltip>
                          <!-- preview image popup -->
                          <v-dialog v-model="portraitPhotoDialog">
                            <v-container>
                              <v-row>
                                <v-spacer></v-spacer>
                                <v-col class="mr-n12" sm="1">
                                  <v-icon
                                    dark
                                    @click="togglePortraitPhotoDialog"
                                    >mdi-close</v-icon
                                  ></v-col
                                >
                              </v-row>

                              <v-img
                                height="82vh"
                                :src="portraitPhotoPreview"
                                contain
                                alt="portraitPhotoimage"
                              ></v-img>
                            </v-container>
                          </v-dialog>
                        </template>
                      </v-file-input>
                    </v-col>
                    <!-- Education Certificate -->
                    <v-col cols="12" sm="6" md="4">
                      <v-file-input
                        v-model="educationCertificateFile"
                        accept="image/*, .pdf"
                        counter
                        chips
                        prepend-icon="mdi-file-document-outline"
                        label="Education Certificate"
                        @change="toggleEducationCertificateInput"
                      >
                        <template v-slot:append>
                          <v-tooltip top>
                            <template v-slot:activator="{ on, attrs }">
                              <v-icon
                                class="ml-auto"
                                v-bind="attrs"
                                v-on="on"
                                @click="toggleEducationCertificateDialog"
                              >
                                mdi-file-eye-outline
                              </v-icon>
                            </template>
                            <span>Preview</span>
                          </v-tooltip>
                          <!-- preview image popup -->
                          <v-dialog v-model="educationCertificateDialog">
                            <v-container>
                              <v-row>
                                <v-spacer></v-spacer>
                                <v-col class="mr-n12" sm="1">
                                  <v-icon
                                    dark
                                    @click="toggleEducationCertificateDialog"
                                    >mdi-close</v-icon
                                  ></v-col
                                >
                              </v-row>
                              <v-img
                                height="82vh"
                                :src="educationCertificatePreview"
                                contain
                                alt="educationCertificateimage"
                              ></v-img>
                            </v-container>
                          </v-dialog>
                        </template>
                      </v-file-input>
                    </v-col>
                    <!-- Orphan Id -->
                    <v-col cols="12" sm="6" md="4">
                      <v-file-input
                        v-model="orphanIdFile"
                        accept="image/*, .pdf"
                        counter
                        chips
                        prepend-icon="mdi-file-document-outline"
                        label="Orphan Id"
                        @change="toggleOrphanIdInput"
                      >
                        <template v-slot:append>
                          <v-tooltip top>
                            <template v-slot:activator="{ on, attrs }">
                              <v-icon
                                class="ml-auto"
                                v-bind="attrs"
                                v-on="on"
                                @click="toggleOrphanIdDialog"
                              >
                                mdi-file-eye-outline
                              </v-icon>
                            </template>
                            <span>Preview</span>
                          </v-tooltip>
                          <!-- preview image popup -->
                          <v-dialog v-model="orphanIdDialog">
                            <v-container>
                              <v-row>
                                <v-spacer></v-spacer>
                                <v-col class="mr-n12" sm="1">
                                  <v-icon dark @click="toggleOrphanIdDialog"
                                    >mdi-close</v-icon
                                  ></v-col
                                >
                              </v-row>
                              <v-img
                                height="82vh"
                                :src="orphanIdPreview"
                                contain
                                alt="orphanIdimage"
                              ></v-img>
                            </v-container>
                          </v-dialog>
                        </template>
                      </v-file-input>
                    </v-col>
                    <!-- Orphan Passport -->
                    <v-col cols="12" sm="6" md="4">
                      <v-file-input
                        v-model="orphanPassportFile"
                        accept="image/*, .pdf"
                        counter
                        prepend-icon="mdi-file-document-outline"
                        label="Orphan Passport"
                        @change="toggleOrphanPassportInput"
                      >
                        <template v-slot:append>
                          <v-tooltip top>
                            <template v-slot:activator="{ on, attrs }">
                              <v-icon
                                class="ml-auto"
                                v-bind="attrs"
                                v-on="on"
                                @click="toggleOrphanPassportDialog"
                              >
                                mdi-file-eye-outline
                              </v-icon>
                            </template>
                            <span>Preview</span>
                          </v-tooltip>
                          <!-- preview image popup -->
                          <v-dialog v-model="orphanPassportDialog">
                            <v-container>
                              <v-row>
                                <v-spacer></v-spacer>
                                <v-col class="mr-n12" sm="1">
                                  <v-icon
                                    dark
                                    @click="toggleOrphanPassportDialog"
                                    >mdi-close</v-icon
                                  ></v-col
                                >
                              </v-row>
                              <v-img
                                height="82vh"
                                :src="orphanPassportPreview"
                                contain
                                alt="orphanPassportimage"
                              ></v-img>
                            </v-container>
                          </v-dialog>
                        </template>
                      </v-file-input>
                    </v-col>
                  </template>
                  <!-- Father Documents -->
                  <template>
                    <v-col sm="12">
                      <div class="title mt-n3 mb-n5">Father Documents</div>
                    </v-col>
                    <!-- Father Death Certificate -->
                    <v-col cols="12" sm="6" md="4">
                      <v-file-input
                        v-model="fatherDeathCertificateFile"
                        accept="image/*, .pdf"
                        counter
                        prepend-icon="mdi-file-document-outline"
                        :rules="[rules.required]"
                        label="Death Certificate"
                        @change="toggleFatherDeathCertificateInput"
                      >
                        <template v-slot:append>
                          <v-tooltip top>
                            <template v-slot:activator="{ on, attrs }">
                              <v-icon
                                class="ml-auto"
                                v-bind="attrs"
                                v-on="on"
                                @click="toggleFatherDeathCertificateDialog"
                              >
                                mdi-file-eye-outline
                              </v-icon>
                            </template>
                            <span>Preview</span>
                          </v-tooltip>
                          <!-- preview image popup -->
                          <v-dialog v-model="fatherDeathCertificateDialog">
                            <v-container>
                              <v-row>
                                <v-spacer></v-spacer>
                                <v-col class="mr-n12" sm="1">
                                  <v-icon
                                    dark
                                    @click="toggleFatherDeathCertificateDialog"
                                    >mdi-close</v-icon
                                  ></v-col
                                >
                              </v-row>
                              <v-img
                                height="82vh"
                                :src="fatherDeathCertificatePreview"
                                contain
                                alt="fatherDeathCertificateimage"
                              ></v-img>
                            </v-container>
                          </v-dialog>
                        </template>
                      </v-file-input>
                    </v-col>
                  </template>
                  <!-- Guardian Documents -->
                  <template>
                    <v-col sm="12">
                      <div class="title mt-n3 mb-n5">Guardian Documents</div>
                    </v-col>
                    <!-- Guardian Id -->
                    <v-col cols="12" sm="6" md="4">
                      <v-file-input
                        v-model="guardianIdFile"
                        accept="image/*, .pdf"
                        counter
                        prepend-icon="mdi-file-document-outline"
                        :rules="[rules.required]"
                        label="Guardian Id"
                        @change="toggleGuardianIdInput"
                      >
                        <template v-slot:append>
                          <v-tooltip top>
                            <template v-slot:activator="{ on, attrs }">
                              <v-icon
                                class="ml-auto"
                                v-bind="attrs"
                                v-on="on"
                                @click="toggleGuardianIdDialog"
                              >
                                mdi-file-eye-outline
                              </v-icon>
                            </template>
                            <span>Preview</span>
                          </v-tooltip>
                          <!-- preview image popup -->
                          <v-dialog v-model="guardianIdDialog">
                            <v-container>
                              <v-row>
                                <v-spacer></v-spacer>
                                <v-col class="mr-n12" sm="1">
                                  <v-icon dark @click="toggleGuardianIdDialog"
                                    >mdi-close</v-icon
                                  ></v-col
                                >
                              </v-row>
                              <v-img
                                height="82vh"
                                :src="guardianIdPreview"
                                contain
                                alt="guardianIdimage"
                              ></v-img>
                            </v-container>
                          </v-dialog>
                        </template>
                      </v-file-input>
                    </v-col>
                    <!-- Guardian Confirmation Letter -->
                    <v-col cols="12" sm="6" md="4">
                      <v-file-input
                        v-model="guardianConfirmationLetterFile"
                        accept="image/*, .pdf"
                        counter
                        prepend-icon="mdi-file-document-outline"
                        :rules="[rules.required]"
                        label="Guardian Confirmation Letter"
                        @change="toggleGuardianConfirmationLetterInput"
                      >
                        <template v-slot:append>
                          <v-tooltip top>
                            <template v-slot:activator="{ on, attrs }">
                              <v-icon
                                class="ml-auto"
                                v-bind="attrs"
                                v-on="on"
                                @click="toggleGuardianConfirmationLetterDialog"
                              >
                                mdi-file-eye-outline
                              </v-icon>
                            </template>
                            <span>Preview</span>
                          </v-tooltip>
                          <!-- preview image popup -->
                          <v-dialog v-model="guardianConfirmationLetterDialog">
                            <v-container>
                              <v-row>
                                <v-spacer></v-spacer>
                                <v-col class="mr-n12" sm="1">
                                  <v-icon
                                    dark
                                    @click="
                                      toggleGuardianConfirmationLetterDialog
                                    "
                                    >mdi-close</v-icon
                                  ></v-col
                                >
                              </v-row>
                              <v-img
                                height="82vh"
                                :src="guardianConfirmationLetterPreview"
                                contain
                                alt="guardianConfirmationLetterimage"
                              ></v-img>
                            </v-container>
                          </v-dialog>
                        </template>
                      </v-file-input>
                    </v-col>
                    <!-- Guardian Confirmation Letter -->
                    <v-col cols="12" sm="6" md="4">
                      <v-file-input
                        v-model="guardianLegalConfirmationLetterFile"
                        accept="image/*, .pdf"
                        counter
                        prepend-icon="mdi-file-document-outline"
                        :rules="[rules.required]"
                        label="Guardian Confirmation Letter"
                        @change="toggleGuardianLegalConfirmationLetterInput"
                      >
                        <template v-slot:append>
                          <v-tooltip top>
                            <template v-slot:activator="{ on, attrs }">
                              <v-icon
                                class="ml-auto"
                                v-bind="attrs"
                                v-on="on"
                                @click="toggleGuardianLegalConfirmationLetterDialog"
                              >
                                mdi-file-eye-outline
                              </v-icon>
                            </template>
                            <span>Preview</span>
                          </v-tooltip>
                          <!-- preview image popup -->
                          <v-dialog v-model="guardianLegalConfirmationLetterDialog">
                            <v-container>
                              <v-row>
                                <v-spacer></v-spacer>
                                <v-col class="mr-n12" sm="1">
                                  <v-icon
                                    dark
                                    @click="
                                      toggleGuardianLegalConfirmationLetterDialog
                                    "
                                    >mdi-close</v-icon
                                  ></v-col
                                >
                              </v-row>
                              <v-img
                                height="82vh"
                                :src="guardianLegalConfirmationLetterPreview"
                                contain
                                alt="guardianLegalConfirmationLetterimage"
                              ></v-img>
                            </v-container>
                          </v-dialog>
                        </template>
                      </v-file-input>
                    </v-col>
                  </template>
                </v-row>
              </v-container>
            </v-form>
          </v-card-text>
          <v-divider class="mt-3"></v-divider>
          <!-- the action part; the buttons part -->
          <v-card-actions>
            <v-btn color="red darken-1" text @click="documentDialogCancel">
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
                    @click="documentDialogReset"
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
              @click="documentDialogSave"
              :disabled="!validDocumentForm"
            >
              Save
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
      validDocumentForm: false,
      formHasErrors: false,
      orphan: {
        birthCertificateUrl: null,
        idCardUrl: null,
        passportUrl: null,
        father: {
          deathCertificateUrl: null,
        },
        guardian: {
          guardianIDCardUrl: null,
          guardianConfirmationLetterUrl: null,
          guardianLegalConfirmationLetterUrl: null,
        },
        photos: {
          photoPortraitUrl: null,
        }
      },
      rules: {
        required: (value) => !!value || "Required.",
      },
      birthCertificateDialog: false,
      birthCertificateFile: null,
      birthCertificatePreview: null,
      portraitPhotoDialog: false,
      portraitPhotoFile: null,
      portraitPhotoPreview: null,
      educationCertificateDialog: false,
      educationCertificateFile: null,
      educationCertificatePreview: false,
      orphanIdDialog: false,
      orphanIdFile: null,
      orphanIdPreview: null,
      orphanPassportDialog: false,
      orphanPassportFile: null,
      orphanPassportPreview: null,
      fatherDeathCertificateDialog: false,
      fatherDeathCertificateFile: null,
      fatherDeathCertificatePreview: null,
      guardianIdDialog: false,
      guardianIdFile: null,
      guardianIdPreview: null,
      guardianConfirmationLetterDialog: false,
      guardianConfirmationLetterFile: null,
      guardianConfirmationLetterPreview: null,
      guardianLegalConfirmationLetterDialog: false,
      guardianLegalConfirmationLetterFile: null,
      guardianLegalConfirmationLetterPreview: null,
    };
  },
  computed: {},
  watch: {
    // dialog
    dialog(val) {
      val || this.documentDialogClose();
    },
  },
  methods: {
    // dialog
    // assign the entered image to preview
    // Birth Certificate
    toggleBirthCertificateInput() {
      console.log(this.birthCertificateFile);
      if (this.birthCertificateFile) {
        this.birthCertificatePreview = URL.createObjectURL(
          this.birthCertificateFile
        );
        console.log("Preview", this.birthCertificatePreview);
      }
    },
    toggleBirthCertificateDialog() {
      this.birthCertificateDialog = !this.birthCertificateDialog;
    },
    // Portrait Photo
    togglePortraitPhotoInput() {
      console.log(this.portraitPhotoFile);
      if (this.portraitPhotoFile) {
        this.portraitPhotoPreview = URL.createObjectURL(this.portraitPhotoFile);
      }
    },
    togglePortraitPhotoDialog() {
      this.portraitPhotoDialog = !this.portraitPhotoDialog;
    },
    // Education Certificate
    toggleEducationCertificateInput() {
      console.log(this.educationCertificateFile);
      if (this.educationCertificateFile) {
        this.educationCertificatePreview = URL.createObjectURL(
          this.educationCertificateFile
        );
      }
    },
    toggleEducationCertificateDialog() {
      this.educationCertificateDialog = !this.educationCertificateDialog;
    },
    // Orphan Id
    toggleOrphanIdInput() {
      console.log(this.orphanIdFile);
      if (this.orphanIdFile) {
        this.orphanIdPreview = URL.createObjectURL(this.orphanIdFile);
      }
    },
    toggleOrphanIdDialog() {
      this.orphanIdDialog = !this.orphanIdDialog;
    },
    // Orphan Passport
    toggleOrphanPassportInput() {
      console.log(this.orphanPassportFile);
      if (this.orphanPassportFile) {
        this.orphanPassportPreview = URL.createObjectURL(
          this.orphanPassportFile
        );
      }
    },
    toggleOrphanPassportDialog() {
      this.orphanPassportDialog = !this.orphanPassportDialog;
    },
    // Father Death Certificate
    toggleFatherDeathCertificateInput() {
      console.log(this.fatherDeathCertificateFile);
      if (this.fatherDeathCertificateFile) {
        this.fatherDeathCertificatePreview = URL.createObjectURL(
          this.fatherDeathCertificateFile
        );
      }
    },
    toggleFatherDeathCertificateDialog() {
      this.fatherDeathCertificateDialog = !this.fatherDeathCertificateDialog;
    },
    // Guardian Id
    toggleGuardianIdInput() {
      console.log(this.guardianIdFile);
      if (this.guardianIdFile) {
        this.guardianIdPreview = URL.createObjectURL(this.guardianIdFile);
      }
    },
    toggleGuardianIdDialog() {
      this.guardianIdDialog = !this.guardianIdDialog;
    },
    // Guardian Confirmation Letter
    toggleGuardianConfirmationLetterInput() {
      console.log(this.guardianConfirmationLetterFile);
      if (this.guardianConfirmationLetterFile) {
        this.guardianConfirmationLetterPreview = URL.createObjectURL(
          this.guardianConfirmationLetterFile
        );
      }
    },
    toggleGuardianConfirmationLetterDialog() {
      this.guardianConfirmationLetterDialog = !this
        .guardianConfirmationLetterDialog;
    },
    // Guardian Legal Confirmation Letter
    toggleGuardianLegalConfirmationLetterInput() {
      console.log(this.guardianLegalConfirmationLetterFile);
      if (this.guardianLegalConfirmationLetterFile) {
        this.guardianLegalConfirmationLetterPreview = URL.createObjectURL(
          this.guardianLegalConfirmationLetterFile
        );
      }
    },
    toggleGuardianLegalConfirmationLetterDialog() {
      this.guardianLegalConfirmationLetterDialog = !this
        .guardianLegalConfirmationLetterDialog;
    },

    documentDialogClose() {
      this.dialog = false;

      // this.$nextTick(() => {
      //   this.orphanItem = Object.assign({}, this.defaultItem);
      //   this.orphanIndex = -1;
      // });
    },

    documentDialogReset() {
      this.formHasErrors = false;
      this.$refs.documentForm.reset();
    },

    documentDialogSave() {
      // if (this.orphanIndex > -1) {
      //   Object.assign(this.orphans[this.orphanIndex], this.orphanItem);
      // } else {
      //   this.orphans.push(this.orphanItem);
      // }

      this.formHasErrors = false;

      if (this.$refs.documentForm.validate()) {
        // console.log(this.orphan);
        // this.orphanDialogReset();
      } else if (!this.$refs.documentForm.validate()) {
        this.formHasErrors = true;
      }
    },

    documentDialogCancel() {
      this.documentDialogReset();
      // this.documentDialogClose();
    },
  },
};
</script>
