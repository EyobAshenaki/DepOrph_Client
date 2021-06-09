<template style="positon: relative;">
  <!-- TODO: # add new orphan adding functionality -->
  <v-row justify="center" no-gutters>
    <!-- Table Card -->
    <!-- TODO: # add a details column -->
    <!--       # impliment editable fullName * NEW FEATURE * -->
    <!--       # impliment a custom pagination -->
    <!--       # add chips in the sponsoreship status column -->
    <v-col cols="9" style="margin-top: 7rem">
      <v-card>
        <v-row>
          <v-col cols="12" class="d-flex pb-0">
            <!-- back Button -->
            <v-col>
              <v-btn fab small class="ml-4" @click="goToCoordinatorTable()">
                <v-icon> mdi-arrow-left </v-icon>
              </v-btn>
            </v-col>
            <!-- Select Orphan -->
            <v-col>
              <v-btn class="primary" @click="selectOrphans">
                {{ orphanSelectBtnLable }}
              </v-btn>
              <v-dialog
                v-model="showDonorSelectionDialog"
                width="30%"
                persistent
              >
                <v-card>
                  <v-card-title class="justify-center">
                    Choose Donor
                  </v-card-title>
                  <v-responsive
                    min-width="200"
                    max-width="200"
                    class="pl-0 mx-auto"
                  >
                    <v-select
                      v-model="selectedOrphanDonor"
                      :items="selectedOrphanDonorOptions"
                      item-text="nameInitials"
                      item-value="nameInitials"
                      :menu-props="{ bottom: true, offsetY: true }"
                      solo
                      outlined
                      dense
                    >
                    </v-select>
                  </v-responsive>
                  <v-card-actions class="justify-end">
                    <v-btn text class="red--text" @click="cancelOrphanChoice"
                      >Cancel</v-btn
                    >
                    <v-btn text class="primary--text" @click="chooseOrphans"
                      >Confirm</v-btn
                    >
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-col>
            <!-- New Orphan Registration -->
            <v-col class="justify-end" cols="4">
              <v-fab-transition>
                <NewOrphanRegistrationModel />
              </v-fab-transition>
            </v-col>
          </v-col>
          <v-col cols="12">
            <!-- REMOVED filter select and search / filter  -->
            <!-- <v-row>
        <v-col sm="2" style="padding-top: 0px; padding-bottom: 20px;">
        </v-col>
        <v-col sm="5">
          <v-responsive
            min-width="320"
            max-width="320"
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
        <v-col sm="4">
          <v-responsive max-width="300" class=" ml-sm-3 mt-sm-4">
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
      </v-row> -->
            <v-expansion-panels popout v-model="orphanPanel">
              <!-- Active -->
              <v-expansion-panel>
                <v-expansion-panel-header>
                  <template v-slot:default="{ open }">
                    <v-row no-gutters>
                      <v-col cols="4"> Active </v-col>
                      <v-col cols="8" class="text--secondary">
                        <v-fade-transition leave-absolute>
                          <span v-if="open" key="0"></span>
                          <span v-else key="1"></span>
                        </v-fade-transition>
                      </v-col>
                    </v-row>
                  </template>
                </v-expansion-panel-header>
                <v-expansion-panel-content style="padding-right: 0px">
                  <v-card elevation="16">
                    <v-sheet
                      id="scrolling-techniques-3"
                      class="overflow-y-auto"
                      max-height="70vh"
                    >
                      <v-data-table
                        :headers="headers"
                        :items="activeOrphans"
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
                                    <span
                                      v-if="index === 1"
                                      class="grey--text caption"
                                    >
                                      (+{{ filterValue.length - 1 }} others)
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
                              <v-responsive
                                max-width="300"
                                class="ml-sm-3 mt-sm-4"
                              >
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
                        <!-- edit dialog pop-up for Full Name column -->
                        <!-- TODO: impliment this functionality for all the other columns if needed -->
                        <template v-slot:item.fullName="props">
                          <!-- "large" for the buttons, "persistent" for blocking closing of edit-dialog when clicked outside -->
                          <v-edit-dialog
                            :return-value.sync="props.item.fullName"
                            large
                            persistent
                            cancel-text="Cancel"
                            save-text="Save"
                            @save="save"
                            @cancel="cancel"
                            @open="open"
                            @close="close"
                          >
                            {{ props.item.fullName }}
                            <template v-slot:input>
                              <v-text-field
                                v-model="props.item.fullName"
                                :rules="[max25chars]"
                                label="Edit"
                                single-line
                                counter
                                autofocus
                              ></v-text-field>
                            </template>
                          </v-edit-dialog>
                        </template>
                        <!-- edit dialog pop-up for Sponsorship Status column -->
                        <template v-slot:item.sponsorshipStatus="props">
                          <v-edit-dialog
                            :return-value.sync="props.item.sponsorshipStatus"
                            large
                            persistent
                            cancel-text="Cancel"
                            save-text="Save"
                            @save="save"
                            @cancel="cancel"
                            @open="open"
                            @close="close"
                          >
                            {{ props.item.sponsorshipStatus }}
                            <template v-slot:input>
                              <v-text-field
                                v-model="props.item.sponsorshipStatus"
                                :rules="[max25chars]"
                                label="Edit"
                                single-line
                                counter
                                autofocus
                              ></v-text-field>
                            </template>
                          </v-edit-dialog>
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
                        <template v-slot:item.sponsoredDate="{ item }">
                          {{ calcSponsoredDate(item) }}
                        </template>
                      </v-data-table>
                      <!-- becomes visble when full name is edited -->
                      <!-- TODO: # Impliment a loding functionality -->
                      <!--       # maybe server side validation also -->
                      <v-snackbar
                        v-model="snack"
                        :timeout="3000"
                        :color="snackColor"
                      >
                        {{ snackText }}

                        <template v-slot:action="{ attrs }">
                          <v-btn v-bind="attrs" text @click="snack = false">
                            Close
                          </v-btn>
                        </template>
                      </v-snackbar>
                    </v-sheet>
                  </v-card>
                </v-expansion-panel-content>
              </v-expansion-panel>
              <!-- Processing -->
              <v-expansion-panel>
                <v-expansion-panel-header>
                  <template v-slot:default="{ open }">
                    <v-row no-gutters>
                      <v-col cols="4"> Processing </v-col>
                      <v-col cols="8" class="text--secondary">
                        <v-fade-transition leave-absolute>
                          <span v-if="open" key="0"></span>
                          <span v-else key="1"></span>
                        </v-fade-transition>
                      </v-col>
                    </v-row>
                  </template>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-card elevation="16">
                    <v-sheet
                      id="scrolling-techniques-3"
                      class="overflow-y-auto"
                      max-height="56vh"
                    >
                      <v-data-table
                        v-model="selectedOrphans"
                        :headers="headers"
                        :items="processingOrphans"
                        item-key="id"
                        :search="search"
                        append-icon="mdi-magnify"
                        :custom-filter="searchFilter"
                        :show-select="orphanShow"
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
                                    <span
                                      v-if="index === 1"
                                      class="grey--text caption"
                                    >
                                      (+{{ filterValue.length - 1 }} others)
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
                              <v-responsive
                                max-width="300"
                                class="ml-sm-3 mt-sm-4"
                              >
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
                          <!-- Old Show Details dialog -->
                          <v-dialog
                            v-model="detailDialog"
                            transition="dialog-bottom-transition"
                            fullscreen
                            persistent
                            max-width="600"
                          >
                            <template v-slot:default="dialog">
                              <v-card max-width="">
                                <v-toolbar dense flat color="primary" dark>
                                  <span class="mx-auto">
                                    {{ "Name's Detail" }}
                                  </span>
                                </v-toolbar>
                                <v-card-text class="pb-0">
                                  <v-container>
                                    <v-row>
                                      <v-col cols="6">
                                        <v-img
                                          :src="
                                            `https://picsum.photos/500/300?image=20`
                                          "
                                          :lazy-src="
                                            `https://picsum.photos/10/6?image=20`
                                          "
                                          aspect-ratio="1"
                                          class="grey lighten-2"
                                        >
                                          <template v-slot:placeholder>
                                            <v-row
                                              class="fill-height ma-0"
                                              align="center"
                                              justify="center"
                                            >
                                              <v-progress-circular
                                                indeterminate
                                                color="grey lighten-5"
                                              ></v-progress-circular>
                                            </v-row>
                                          </template>
                                        </v-img>
                                      </v-col>
                                      <v-col cols="6">
                                        <v-row>
                                          <!-- Orphan Name field -->
                                          <v-col
                                            cols="12"
                                            sm="6"
                                            md="12"
                                            class="py-0"
                                          >
                                            <v-responsive max-width="" class="">
                                              <v-text-field
                                                v-model="orphanItems.orphanName"
                                                label="Orphan Name"
                                                readonly
                                              >
                                              </v-text-field>
                                            </v-responsive>
                                          </v-col>
                                          <!-- Father Name field -->
                                          <v-col
                                            cols="12"
                                            sm="6"
                                            md="12"
                                            class="py-0"
                                          >
                                            <v-responsive max-width="" class="">
                                              <v-text-field
                                                v-model="orphanItems.fatherName"
                                                label="Father Name"
                                                readonly
                                              >
                                              </v-text-field>
                                            </v-responsive>
                                          </v-col>
                                          <!-- Grand Father Name field -->
                                          <v-col
                                            cols="12"
                                            sm="6"
                                            md="12"
                                            class="py-0"
                                          >
                                            <v-responsive max-width="" class="">
                                              <v-text-field
                                                v-model="
                                                  orphanItems.grandFatherName
                                                "
                                                label="Grand Father Name"
                                                readonly
                                              >
                                              </v-text-field>
                                            </v-responsive>
                                          </v-col>
                                          <!-- Date of Birth field -->
                                          <v-col
                                            cols="12"
                                            sm="6"
                                            md="12"
                                            class="py-0 mt-n1"
                                          >
                                            <v-responsive max-width="" class="">
                                              <v-menu
                                                ref="menu"
                                                v-model="orphanDateOfBirthMenu"
                                                :close-on-content-click="false"
                                                transition="scale-transition"
                                                offset-y
                                                min-width="auto"
                                                disabled
                                              >
                                                <template
                                                  v-slot:activator="{
                                                    on,
                                                    attrs,
                                                  }"
                                                >
                                                  <v-text-field
                                                    v-model="orphanDateOfBirth"
                                                    label="Date of Birth"
                                                    prepend-icon="mdi-calendar"
                                                    readonly
                                                    v-bind="attrs"
                                                    v-on="on"
                                                  ></v-text-field>
                                                </template>
                                                <v-date-picker
                                                  ref="picker"
                                                  v-model="orphanDateOfBirth"
                                                  no-title
                                                  scrollable
                                                  :max="
                                                    new Date()
                                                      .toISOString()
                                                      .substr(0, 10)
                                                  "
                                                  min="1950-01-01"
                                                  @change="
                                                    orphanDateOfBirthSave
                                                  "
                                                >
                                                </v-date-picker>
                                              </v-menu>
                                            </v-responsive>
                                          </v-col>
                                        </v-row>
                                      </v-col>
                                      <!-- Gender -->
                                      <v-col
                                        cols="12"
                                        sm="6"
                                        md="3"
                                        class="pb-0"
                                      >
                                        <v-responsive max-width="" class="">
                                          <v-text-field
                                            v-model="orphanItems.gender"
                                            label="Gender"
                                            readonly
                                          >
                                          </v-text-field>
                                        </v-responsive>
                                      </v-col>
                                      <!-- Place of Birth -->
                                      <v-col
                                        cols="12"
                                        sm="6"
                                        md="6"
                                        class="pb-0"
                                      >
                                        <v-responsive max-width="" class="">
                                          <v-text-field
                                            v-model="orphanItems.placeOfBirth"
                                            label="Place of Birth"
                                            readonly
                                          >
                                          </v-text-field>
                                        </v-responsive>
                                      </v-col>
                                      <!-- Religion -->
                                      <v-col
                                        cols="12"
                                        sm="6"
                                        md="3"
                                        class="pb-0"
                                      >
                                        <v-responsive max-width="" class="">
                                          <v-text-field
                                            v-model="orphanItems.religion"
                                            label="Religion"
                                            readonly
                                          >
                                          </v-text-field>
                                        </v-responsive>
                                      </v-col>
                                      <!-- Spoken Language(s) -->
                                      <v-col
                                        cols="12"
                                        sm="6"
                                        md="6"
                                        class="py-0"
                                      >
                                        <v-responsive max-width="" class="">
                                          <v-text-field
                                            v-model="
                                              orphanItems.spokenLanguages
                                            "
                                            label="Spoken Language(s)"
                                            readonly
                                          >
                                          </v-text-field>
                                        </v-responsive>
                                      </v-col>
                                      <!-- Psychological Status -->
                                      <v-col
                                        cols="12"
                                        sm="6"
                                        md="6"
                                        class="py-0"
                                      >
                                        <v-responsive max-width="" class="">
                                          <v-text-field
                                            v-model="
                                              orphanItems.psychologicalStatus
                                            "
                                            label="Psychological Status"
                                            readonly
                                          >
                                          </v-text-field>
                                        </v-responsive>
                                      </v-col>
                                      <!-- Health Discription -->
                                      <v-col
                                        cols="12"
                                        sm="6"
                                        md="12"
                                        class="py-0"
                                      >
                                        <v-responsive max-width="" class="">
                                          <v-textarea
                                            v-model="orphanHealthDescription"
                                            label="Health Discription"
                                            auto-grow
                                            rows="1"
                                            readonly
                                          ></v-textarea>
                                        </v-responsive>
                                      </v-col>
                                      <!-- ************************************************** -->
                                      <!-- Enrollment Status -->
                                      <v-col cols="12" sm="12" md="4">
                                        <v-responsive max-width="200" class="">
                                          <v-text-field
                                            v-model="
                                              orphanItems.enrollmentStatus
                                            "
                                            label="Enrollment Status"
                                            readonly
                                          >
                                          </v-text-field>
                                        </v-responsive>
                                      </v-col>
                                      <!-- If Enrolled or Drop-out -->
                                      <template
                                        v-if="
                                          enrollmentStatusDisplay ===
                                            'Enrolled' ||
                                            enrollmentStatusDisplay ===
                                              'Dropout'
                                        "
                                      >
                                        <!-- Education Level -->
                                        <v-col cols="12" sm="6" md="4">
                                          <v-responsive
                                            max-width="270"
                                            class=""
                                          >
                                            <v-text-field
                                              v-model="
                                                orphanItems.educationLevel
                                              "
                                              label="Enrollment Level"
                                              readonly
                                            >
                                            </v-text-field>
                                          </v-responsive>
                                        </v-col>
                                        <!-- Grade/Year -->
                                        <v-col cols="12" sm="6" md="4">
                                          <v-responsive max-width="" class="">
                                            <v-text-field
                                              v-model="
                                                orphanItems.educationYearState
                                              "
                                              label="Grade/Year"
                                              readonly
                                            >
                                            </v-text-field>
                                          </v-responsive>
                                        </v-col>
                                      </template>
                                      <!-- If Enrolled -->
                                      <template
                                        v-if="
                                          enrollmentStatusDisplay === 'Enrolled'
                                        "
                                      >
                                        <!-- School Type -->
                                        <v-col cols="12" sm="6" md="3">
                                          <v-responsive max-width="" class="">
                                            <v-text-field
                                              v-model="orphanItems.schoolType"
                                              label="School Type"
                                              readonly
                                            >
                                            </v-text-field>
                                          </v-responsive>
                                        </v-col>
                                        <!-- School/University Name -->
                                        <v-col cols="12" sm="6" md="4">
                                          <v-responsive max-width="" class="">
                                            <v-text-field
                                              v-model="orphanItems.schoolName"
                                              label="School/University Name"
                                            >
                                            </v-text-field>
                                          </v-responsive>
                                        </v-col>
                                      </template>
                                      <!-- If Drop-out -->
                                      <template
                                        v-if="
                                          enrollmentStatusDisplay === 'Dropout'
                                        "
                                      >
                                        <!-- Reason for Drop-out -->
                                        <v-col cols="12" sm="12" md="5">
                                          <v-responsive max-width="" class="">
                                            <v-text-field
                                              v-model="
                                                orphanItem.reasonForDropout
                                              "
                                              label="Reason for dropping out"
                                            >
                                            </v-text-field>
                                          </v-responsive>
                                        </v-col>
                                      </template>
                                      <!-- If Un-Enrolled -->
                                      <template
                                        v-if="
                                          enrollmentStatusDisplay ===
                                            'Unenrolled'
                                        "
                                      >
                                        <!-- Reason for Un-Enrolled -->
                                        <v-col cols="12" sm="12" md="8">
                                          <v-responsive max-width="" class="">
                                            <v-text-field
                                              v-model="
                                                orphanItems.reasonForUnenrolled
                                              "
                                              label="Reason for not enrolling"
                                            >
                                            </v-text-field>
                                          </v-responsive>
                                        </v-col>
                                      </template>
                                      <!-- Hobbies -->
                                      <v-col cols="12" sm="12" md="4">
                                        <v-responsive max-width="" class="">
                                          <v-text-field
                                            v-model="orphanItems.hobbies"
                                            label="Hobbies"
                                          >
                                          </v-text-field>
                                        </v-responsive>
                                      </v-col>
                                      <v-col cols="3">
                                        <v-btn
                                          class="mb-n10 ml-n4"
                                          @click="
                                            toggleEducationCertificateDialog
                                          "
                                          >Educational Record</v-btn
                                        >
                                        <v-dialog
                                          v-model="educationCertificateDialog"
                                        >
                                          <v-container>
                                            <v-row>
                                              <v-spacer></v-spacer>
                                              <v-col class="mr-n12" sm="1">
                                                <v-icon
                                                  dark
                                                  @click="
                                                    toggleEducationCertificateDialog
                                                  "
                                                  >mdi-close</v-icon
                                                ></v-col
                                              >
                                            </v-row>
                                            <v-img
                                              height="82vh"
                                              src="@/assets/1-crop.jpg"
                                              contain
                                              alt="educationCertificateimage"
                                            ></v-img>
                                          </v-container>
                                        </v-dialog>
                                      </v-col>
                                      <!-- **************************************************** -->

                                      <!-- Father Section -->
                                      <template>
                                        <v-col sm="12" class="mb-n2">
                                          <div class="title mb-n5 pt-0">
                                            Father
                                          </div>
                                        </v-col>
                                        <!-- Father Date of Birth field -->
                                        <v-col cols="12" sm="6" md="6">
                                          <v-responsive max-width="" class="">
                                            <v-menu
                                              ref="fatherDateOfBirthMenu"
                                              v-model="fatherDateOfBirthMenu"
                                              :close-on-content-click="false"
                                              transition="scale-transition"
                                              offset-y
                                              min-width="auto"
                                              disabled
                                            >
                                              <template
                                                v-slot:activator="{ on, attrs }"
                                              >
                                                <v-text-field
                                                  v-model="
                                                    fatherDateOfBirthDate
                                                  "
                                                  label="Date of Birth"
                                                  prepend-icon="mdi-calendar"
                                                  readonly
                                                  v-bind="attrs"
                                                  v-on="on"
                                                ></v-text-field>
                                              </template>
                                              <v-date-picker
                                                ref="fatherDateOfBirthPicker"
                                                v-model="fatherDateOfBirthDate"
                                                no-title
                                                scrollable
                                                :max="
                                                  new Date()
                                                    .toISOString()
                                                    .substr(0, 10)
                                                "
                                                min="1950-01-01"
                                              >
                                              </v-date-picker>
                                            </v-menu>
                                          </v-responsive>
                                        </v-col>
                                        <!-- Father Date of Death field -->
                                        <v-col cols="12" sm="6" md="6">
                                          <v-responsive max-width="" class="">
                                            <v-menu
                                              ref="fatherDateOfDeathMenu"
                                              v-model="fatherDateOfDeathMenu"
                                              :close-on-content-click="false"
                                              transition="scale-transition"
                                              offset-y
                                              min-width="auto"
                                              disabled
                                            >
                                              <template
                                                v-slot:activator="{ on, attrs }"
                                              >
                                                <v-text-field
                                                  v-model="
                                                    fatherDateOfDeathDate
                                                  "
                                                  label="Date of Death"
                                                  prepend-icon="mdi-calendar"
                                                  readonly
                                                  v-bind="attrs"
                                                  v-on="on"
                                                ></v-text-field>
                                              </template>
                                              <v-date-picker
                                                ref="fatherDateOfDeathPicker"
                                                v-model="fatherDateOfDeathDate"
                                                no-title
                                                scrollable
                                                :max="
                                                  new Date()
                                                    .toISOString()
                                                    .substr(0, 10)
                                                "
                                                min="1950-01-01"
                                              >
                                              </v-date-picker>
                                            </v-menu>
                                          </v-responsive>
                                        </v-col>
                                        <!-- TODO # change this field to select when provided -->
                                        <!-- Father Cause of Death field-->
                                        <v-col
                                          cols="12"
                                          sm="6"
                                          md="6"
                                          class="pt-0 mt-n3"
                                        >
                                          <v-responsive max-width="" class="">
                                            <v-text-field
                                              v-model="
                                                orphanItems.fatherCauseOfDeath
                                              "
                                              label="Cause of Death"
                                              readonly
                                            >
                                            </v-text-field>
                                          </v-responsive>
                                        </v-col>
                                        <!-- Father death Certificate -->
                                        <v-col cols="3">
                                          <v-btn
                                            class="mt-n2"
                                            @click="
                                              toggleFatherDeathCertificateDialog
                                            "
                                            >Death Certificate</v-btn
                                          >
                                          <v-dialog
                                            v-model="
                                              fatherDeathCertificateDialog
                                            "
                                          >
                                            <v-container>
                                              <v-row>
                                                <v-spacer></v-spacer>
                                                <v-col class="mr-n12" sm="1">
                                                  <v-icon
                                                    dark
                                                    @click="
                                                      toggleFatherDeathCertificateDialog
                                                    "
                                                    >mdi-close</v-icon
                                                  ></v-col
                                                >
                                              </v-row>
                                              <v-img
                                                height="82vh"
                                                src="@/assets/29945230.png"
                                                contain
                                                alt="fatherDeathCertificateimage"
                                              ></v-img>
                                            </v-container>
                                          </v-dialog>
                                        </v-col>
                                      </template>
                                      <!-- Mother Section -->
                                      <template>
                                        <v-col sm="12" class="mt-n4 mb-n2">
                                          <div class="title mt-n3 mb-n5">
                                            Mother
                                          </div>
                                        </v-col>
                                        <!-- Mother First Name field-->
                                        <v-col cols="12" sm="6" md="4">
                                          <v-responsive max-width="" class="">
                                            <v-text-field
                                              v-model="
                                                orphanItems.motherFirstName
                                              "
                                              label="First Name"
                                              readonly
                                            >
                                            </v-text-field>
                                          </v-responsive>
                                        </v-col>
                                        <!-- Mather Middle Name field-->
                                        <v-col cols="12" sm="6" md="4">
                                          <v-responsive max-width="" class="">
                                            <v-text-field
                                              v-model="
                                                orphanItems.motherMiddleName
                                              "
                                              label="Middle Name"
                                              readonly
                                            >
                                            </v-text-field>
                                          </v-responsive>
                                        </v-col>
                                        <!-- Mother Last Name field -->
                                        <v-col cols="12" sm="6" md="4">
                                          <v-responsive max-width="" class="">
                                            <v-text-field
                                              v-model="
                                                orphanItems.motherLastName
                                              "
                                              label="Last Name"
                                              readonly
                                            >
                                            </v-text-field>
                                          </v-responsive>
                                        </v-col>
                                        <!-- Mother Date of Birth field -->
                                        <v-col
                                          cols="12"
                                          sm="6"
                                          md="4"
                                          class="mt-n6"
                                        >
                                          <v-responsive max-width="" class="">
                                            <v-menu
                                              ref="motherDateOfBirthMenu"
                                              v-model="motherDateOfBirthMenu"
                                              :close-on-content-click="false"
                                              transition="scale-transition"
                                              offset-y
                                              min-width="auto"
                                              disabled
                                            >
                                              <template
                                                v-slot:activator="{ on, attrs }"
                                              >
                                                <v-text-field
                                                  v-model="
                                                    motherDateOfBirthDate
                                                  "
                                                  label="Date of Birth"
                                                  prepend-icon="mdi-calendar"
                                                  readonly
                                                  v-bind="attrs"
                                                  v-on="on"
                                                ></v-text-field>
                                              </template>
                                              <v-date-picker
                                                ref="motherDateOfBirthPicker"
                                                v-model="motherDateOfBirthDate"
                                                no-title
                                                scrollable
                                                :max="
                                                  new Date()
                                                    .toISOString()
                                                    .substr(0, 10)
                                                "
                                                min="1950-01-01"
                                              >
                                              </v-date-picker>
                                            </v-menu>
                                          </v-responsive>
                                        </v-col>
                                        <!-- Mother Vital Status field -->
                                        <v-col
                                          cols="12"
                                          sm="6"
                                          md="4"
                                          class="mt-n6"
                                        >
                                          <v-responsive max-width="" class="">
                                            <v-text-field
                                              v-model="
                                                orphanItems.motherVitalStatus
                                              "
                                              label="Vital Status"
                                              readonly
                                            >
                                            </v-text-field>
                                          </v-responsive>
                                        </v-col>
                                        <!-- Mother Martial Status field -->
                                        <template
                                          v-if="
                                            orphanItems.motherVitalStatus ===
                                              'alive'
                                          "
                                        >
                                          <v-col
                                            cols="12"
                                            sm="6"
                                            md="4"
                                            class="mt-n6"
                                          >
                                            <v-responsive max-width="" class="">
                                              <v-text-field
                                                v-model="
                                                  orphanItems.motherMaritalStatus
                                                "
                                                label="Marital Status"
                                                readonly
                                              >
                                              </v-text-field>
                                            </v-responsive>
                                          </v-col>
                                        </template>
                                      </template>
                                      <!-- House and Property Info -->
                                      <template class="mt-n4">
                                        <v-col sm="12">
                                          <div class="title mt-n3 mb-n5">
                                            Housing and Property
                                          </div>
                                        </v-col>
                                        <!-- TODO # change this field to select -->
                                        <!-- Housing Situation field -->
                                        <v-col
                                          cols="12"
                                          sm="6"
                                          md="5"
                                          class="mb-n3"
                                        >
                                          <v-text-field
                                            v-model="
                                              orphanItems.housingSituation
                                            "
                                            label="Housing Situation"
                                            readonly
                                          >
                                          </v-text-field>
                                        </v-col>
                                        <!-- Birth Certificate Dialog -->
                                        <v-col cols="3">
                                          <v-dialog
                                            v-model="birthCertificateDialog"
                                          >
                                            <v-container>
                                              <v-row>
                                                <v-spacer></v-spacer>
                                                <v-col class="mr-n12" sm="1">
                                                  <v-icon
                                                    dark
                                                    @click="
                                                      toggleBirthCertificateDialog
                                                    "
                                                  >
                                                    mdi-close
                                                  </v-icon>
                                                </v-col>
                                              </v-row>

                                              <v-img
                                                height="82vh"
                                                src="@/assets/orphanTable_v1.png"
                                                contain
                                                alt="birthCertificateimage"
                                              ></v-img>
                                            </v-container>
                                          </v-dialog>
                                          <v-btn
                                            class="mb-n10"
                                            @click="
                                              toggleBirthCertificateDialog
                                            "
                                            >Orphan Birth Certificate</v-btn
                                          >
                                        </v-col>
                                        <!-- Other Properties -->
                                        <v-col
                                          cols="12"
                                          sm="12"
                                          md="12"
                                          class="mt-n5"
                                        >
                                          <v-responsive max-width="" class="">
                                            <v-textarea
                                              v-model="
                                                orphanItems.otherProperties
                                              "
                                              label="Other Properties"
                                              auto-grow
                                              rows="1"
                                              readonly
                                            ></v-textarea>
                                          </v-responsive>
                                        </v-col>
                                      </template>
                                    </v-row>
                                  </v-container>
                                </v-card-text>
                                <v-card-actions class="justify-end">
                                  <v-btn text @click="dialog.value = false"
                                    >Submit</v-btn
                                  >
                                </v-card-actions>
                              </v-card>
                            </template>
                          </v-dialog>
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
                        <template v-slot:header.sponsoredDate="{ header }">
                          {{ changeSponsoredDateHeader(header) }}
                        </template>
                        <template v-slot:item.sponsoredDate="{ item }">
                          {{ displaySelectedOrphanDonor(item) }}
                        </template>
                        <template v-slot:item.details="{ item }">
                          <!-- <v-icon @click="showDetails(item)">
                            mdi-account-details
                          </v-icon> -->
                          <orphan-detail :details="item"/>
                        </template>
                      </v-data-table>
                      <!-- becomes visble when full name is edited -->
                      <!-- TODO: # Impliment a loding functionality -->
                      <!--       # maybe server side validation also -->
                      <v-snackbar
                        v-model="snack"
                        :timeout="3000"
                        :color="snackColor"
                      >
                        {{ snackText }}

                        <template v-slot:action="{ attrs }">
                          <v-btn v-bind="attrs" text @click="snack = false">
                            Close
                          </v-btn>
                        </template>
                      </v-snackbar>
                    </v-sheet>
                  </v-card>
                </v-expansion-panel-content>
              </v-expansion-panel>
              <!-- Pending -->
              <v-expansion-panel>
                <v-expansion-panel-header>
                  <template v-slot:default="{ open }">
                    <v-row no-gutters>
                      <v-col cols="4"> Pending </v-col>
                      <v-col cols="8" class="text--secondary">
                        <v-fade-transition leave-absolute>
                          <span v-if="open" key="0"></span>
                          <span v-else key="1"></span>
                        </v-fade-transition>
                      </v-col>
                    </v-row>
                  </template>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-card elevation="16">
                    <v-sheet
                      id="scrolling-techniques-3"
                      class="overflow-y-auto"
                      max-height="56vh"
                    >
                      <v-data-table
                        :headers="headers"
                        :items="pendingOrphans"
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
                                    <span
                                      v-if="index === 1"
                                      class="grey--text caption"
                                    >
                                      (+{{ filterValue.length - 1 }} others)
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
                              <v-responsive
                                max-width="300"
                                class="ml-sm-3 mt-sm-4"
                              >
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
                        <!-- edit dialog pop-up for Full Name column -->
                        <!-- TODO: impliment this functionality for all the other columns if needed -->
                        <template v-slot:item.fullName="props">
                          <!-- "large" for the buttons, "persistent" for blocking closing of edit-dialog when clicked outside -->
                          <v-edit-dialog
                            :return-value.sync="props.item.fullName"
                            large
                            persistent
                            cancel-text="Cancel"
                            save-text="Save"
                            @save="save"
                            @cancel="cancel"
                            @open="open"
                            @close="close"
                          >
                            {{ props.item.fullName }}
                            <template v-slot:input>
                              <v-text-field
                                v-model="props.item.fullName"
                                :rules="[max25chars]"
                                label="Edit"
                                single-line
                                counter
                                autofocus
                              ></v-text-field>
                            </template>
                          </v-edit-dialog>
                        </template>
                        <!-- edit dialog pop-up for Sponsorship Status column -->
                        <template v-slot:item.sponsorshipStatus="props">
                          <v-edit-dialog
                            :return-value.sync="props.item.sponsorshipStatus"
                            large
                            persistent
                            cancel-text="Cancel"
                            save-text="Save"
                            @save="save"
                            @cancel="cancel"
                            @open="open"
                            @close="close"
                          >
                            {{ props.item.sponsorshipStatus }}
                            <template v-slot:input>
                              <v-text-field
                                v-model="props.item.sponsorshipStatus"
                                :rules="[max25chars]"
                                label="Edit"
                                single-line
                                counter
                                autofocus
                              ></v-text-field>
                            </template>
                          </v-edit-dialog>
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
                        <template v-slot:item.sponsoredDate="{ item }">
                          {{ calcSponsoredDate(item) }}
                        </template>
                      </v-data-table>
                      <!-- becomes visble when full name is edited -->
                      <!-- TODO: # Impliment a loding functionality -->
                      <!--       # maybe server side validation also -->
                      <v-snackbar
                        v-model="snack"
                        :timeout="3000"
                        :color="snackColor"
                      >
                        {{ snackText }}

                        <template v-slot:action="{ attrs }">
                          <v-btn v-bind="attrs" text @click="snack = false">
                            Close
                          </v-btn>
                        </template>
                      </v-snackbar>
                    </v-sheet>
                  </v-card>
                </v-expansion-panel-content>
              </v-expansion-panel>
              <!-- Graduated -->
              <v-expansion-panel>
                <v-expansion-panel-header>
                  <template v-slot:default="{ open }">
                    <v-row no-gutters>
                      <v-col cols="4"> Graduated </v-col>
                      <v-col cols="8" class="text--secondary">
                        <v-fade-transition leave-absolute>
                          <span v-if="open" key="0"></span>
                          <span v-else key="1"></span>
                        </v-fade-transition>
                      </v-col>
                    </v-row>
                  </template>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-card elevation="16">
                    <v-sheet
                      id="scrolling-techniques-3"
                      class="overflow-y-auto"
                      max-height="56vh"
                    >
                      <v-data-table
                        :headers="headers"
                        :items="graduatedOrphans"
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
                                    <span
                                      v-if="index === 1"
                                      class="grey--text caption"
                                    >
                                      (+{{ filterValue.length - 1 }} others)
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
                              <v-responsive
                                max-width="300"
                                class="ml-sm-3 mt-sm-4"
                              >
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
                        <!-- edit dialog pop-up for Full Name column -->
                        <!-- TODO: impliment this functionality for all the other columns if needed -->
                        <template v-slot:item.fullName="props">
                          <!-- "large" for the buttons, "persistent" for blocking closing of edit-dialog when clicked outside -->
                          <v-edit-dialog
                            :return-value.sync="props.item.fullName"
                            large
                            persistent
                            cancel-text="Cancel"
                            save-text="Save"
                            @save="save"
                            @cancel="cancel"
                            @open="open"
                            @close="close"
                          >
                            {{ props.item.fullName }}
                            <template v-slot:input>
                              <v-text-field
                                v-model="props.item.fullName"
                                :rules="[max25chars]"
                                label="Edit"
                                single-line
                                counter
                                autofocus
                              ></v-text-field>
                            </template>
                          </v-edit-dialog>
                        </template>
                        <!-- edit dialog pop-up for Sponsorship Status column -->
                        <template v-slot:item.sponsorshipStatus="props">
                          <v-edit-dialog
                            :return-value.sync="props.item.sponsorshipStatus"
                            large
                            persistent
                            cancel-text="Cancel"
                            save-text="Save"
                            @save="save"
                            @cancel="cancel"
                            @open="open"
                            @close="close"
                          >
                            {{ props.item.sponsorshipStatus }}
                            <template v-slot:input>
                              <v-text-field
                                v-model="props.item.sponsorshipStatus"
                                :rules="[max25chars]"
                                label="Edit"
                                single-line
                                counter
                                autofocus
                              ></v-text-field>
                            </template>
                          </v-edit-dialog>
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
                        <template v-slot:item.sponsoredDate="{ item }">
                          {{ calcSponsoredDate(item) }}
                        </template>
                      </v-data-table>
                      <!-- becomes visble when full name is edited -->
                      <!-- TODO: # Impliment a loding functionality -->
                      <!--       # maybe server side validation also -->
                      <v-snackbar
                        v-model="snack"
                        :timeout="3000"
                        :color="snackColor"
                      >
                        {{ snackText }}

                        <template v-slot:action="{ attrs }">
                          <v-btn v-bind="attrs" text @click="snack = false">
                            Close
                          </v-btn>
                        </template>
                      </v-snackbar>
                    </v-sheet>
                  </v-card>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-col>
        </v-row>
      </v-card>
    </v-col>
    <!-- Notification Panel -->
    <!-- TODO: # figure out a way to do notification -->
    <!--  
      <v-card elevation="1" max-width="400" height="120vh">
        <v-virtual-scroll
          :bench="benched"
          :items="items"
          max-height="850"
          item-height="64"
        >
          <template v-slot:default="{ item }">
            <v-list-item :key="item">
              <v-list-item-action>
                <v-btn fab small depressed color="rgba(19,84,122,.5)">
                  {{ item }}
                </v-btn>
              </v-list-item-action>

              <v-list-item-content>
                <v-list-item-title>
                  User Database Record <strong>ID {{ item }}</strong>
                </v-list-item-title>
              </v-list-item-content>

              <v-list-item-action>
                <v-icon small> mdi-open-in-new </v-icon>
              </v-list-item-action>
            </v-list-item>
          </template>
        </v-virtual-scroll>
      </v-card>
    </v-col> -->
  </v-row>
</template>

<style scoped>
/* .dino {
  position: -webkit-sticky;
  position: sticky;
  bottom: 1rem;
} */
</style>

<script>
import axios from "axios";
import NewOrphanRegistrationModel from "@/components/NewOrphanRegistrationModel.vue";
import OrphanDetail from "@/components/OrphanDetail.vue";

export default {
  // name: "OrphanList",
  props: {
    orphanIds: {
      type: Array,
      required: false,
      default: () => [],
    },
  },
  components: {
    NewOrphanRegistrationModel,
    OrphanDetail
  },

  data() {
    return {
      search: "", // used for filter
      drawer: false, // constroles the sidebar
      // test fields *****************
      benched: 0,
      snack: false,
      snackColor: "",
      snackText: "",
      max25chars: (v) => v.length <= 25 || "Input too long!",
      // *****************************
      orphanDetails: {
        id: 0, 
        // showOrphanDetail: false,
      },
      detailDialog: false,
      orphanDateOfBirth: null,
      orphanDateOfBirthMenu: false,
      genderOptions: ["Male", "Female"],
      orphanIndex: 14,
      orphanItems: {
        orphanName: "",
        fatherName: "",
        grandFatherName: "",
        gender: "",
        placeOfBirth: "",
        religion: "",
        spokenLanguages: "",
        psychologicalStatus: "",
        enrollmentStatus: "",
        educationLevel: "",
        educationYearState: "",
        schoolType: "",
        schoolName: "",
        reasonForDropout: "",
        reasonForUnenrolled: "",
        hobbies: "",
        fatherCauseOfDeath: "",
        motherFirstName: "",
        motherMiddleName: "",
        motherLastName: "",
        motherVitalStatus: "",
        motherMaritalStatus: "",
        housingSituation: "",
        otherProperties: "",
      },
      orphanHealthDescription: "",

      // ********************************

      orphanEnrollmentStatusSelect: "",
      orphanEnrollmentStatusOptions: ["Enrolled", "Drop-Out", "Un-Enrolled"],
      orphanSchoolTypeSelect: "",
      orphanSchoolTypeOptions: ["Public", "Private"],
      orphanEducationLevelSelect: "",
      orphanEducationLevelOptions: [
        "Preschool/Religious Education",
        "Kinderguarden",
        "Primary/Elementary",
        "Junior",
        "Highschool",
        "Undergraduate",
        "Postgraduate",
      ],
      orphanEducationYearStateSelect: "",
      orphanEducationYearStateOptions: [],
      orphanSchoolName: "",
      orphanReasonForDropout: "",
      orphanReasonForUnenrolled: "",
      enrollmentStatusDisplay: "",
      orphanHobbies: "",
      educationCertificateDialog: false,

      // ********************************

      fatherDateOfBirthDate: null,
      fatherDateOfBirthMenu: false,
      fatherDateOfDeathDate: null,
      fatherDateOfDeathMenu: false,
      motherFirstName: "",
      motherMiddleName: "",
      motherLastName: "",
      motherDateOfBirthDate: null,
      motherDateOfBirthMenu: false,
      motherVitalStatusSelect: "",
      motherVitalStatusOptions: ["Alive", "Passed Away"],
      motherMaritalStatusSelect: "",
      motherMaritalStatusOptions: ["Widow", "Married"],
      orphanHousingSituationSelect: [],
      orphanHousingSituationOptions: [
        "Privately Owned",
        "Rental",
        "With Relative",
        "Dependent",
      ],
      fatherDeathCertificateDialog: false,
      birthCertificateDialog: false,
      // ********************************
      orphanShow: false,
      orphanSelectBtnLable: "Select Orphans",
      orphanPanel: [],
      selectedOrphans: [],
      showDonorSelectionDialog: false,
      selectedOrphanDonor: "",
      selectedOrphanDonorOptions: [],
      // used in filter selection items
      filterItems: [
        "Id",
        "Full Name",
        "Age",
        "Gender",
        "Sponsorship Status",
        "Sponsorship Date",
      ],
      filterValue: [],
      // used for filter selection
      // table headers if that wasn't clear enough LOL
      headers: [
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
        {
          text: "Details",
          value: "details",
          sortable: false,
        },
      ],
      // table rows/items
      orphans: [],
      activeOrphans: [],
      processingOrphans: [],
      pendingOrphans: [],
      graduatedOrphans: [],
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
    orphans() {
      this.activeOrphans = this.orphans.filter((orphan) => {
        return (
          orphan.sponsorshipStatuses[
            orphan.sponsorshipStatuses.length - 1
          ].status.toLowerCase() === "active"
        );
      });
      this.processingOrphans = this.orphans.filter((orphan) => {
        return (
          orphan.sponsorshipStatuses[
            orphan.sponsorshipStatuses.length - 1
          ].status.toLowerCase() === "processing"
        );
      });
      this.pendingOrphans = this.orphans.filter((orphan) => {
        return (
          orphan.sponsorshipStatuses[
            orphan.sponsorshipStatuses.length - 1
          ].status.toLowerCase() === "pending"
        );
      });
      this.graduatedOrphans = this.orphans.filter((orphan) => {
        return (
          orphan.sponsorshipStatuses[
            orphan.sponsorshipStatuses.length - 1
          ].status.toLowerCase() === "graduated"
        );
      });
    },
    // ***************************************
    // set the Grade/Year based on Education Level
    orphanEducationLevelSelect() {
      if (this.orphanEducationLevelSelect === "Preschool/Religious Education") {
        this.orphanEducationYearStateOptions = ["first", "second", "third"];
      } else if (this.orphanEducationLevelSelect === "Kinderguarden") {
        this.orphanEducationYearStateOptions = [
          "Preparatory",
          "Nursery",
          "LKG",
          "UKG",
        ];
      } else if (this.orphanEducationLevelSelect === "Primary/Elementary") {
        this.orphanEducationYearStateOptions = [1, 2, 3, 4, 5, 6];
      } else if (this.orphanEducationLevelSelect === "Junior") {
        this.orphanEducationYearStateOptions = [7, 8];
      } else if (this.orphanEducationLevelSelect === "Highschool") {
        this.orphanEducationYearStateOptions = [9, 10, 11, 12];
      } else if (
        this.orphanEducationLevelSelect === "Undergraduate" ||
        this.orphanEducationLevelSelect === "Postgraduate"
      ) {
        this.orphanEducationYearStateOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      }
    },
    // ***************************************
  },
  methods: {
    initialize() {
      if (this.orphanIds !== null) {
        for (const id of this.orphanIds) {
          axios
            .post("/graphql/", {
              query: `query orphan($id: ID!) {
                        orphan(id: $id) {
                          id
                          firstName
                          father {
                            firstName
                            lastName
                            dateOfDeath
                            dateOfBirth
                            causeOfDeath
                            deathCertificateUrl
                          }
                          gender
                          dateOfBirth
                          placeOfBirth
                          religion
                          spokenLanguages
                          psychologicalStatus
                          healthDescription
                          education {
                            enrollmentStatus
                            level
                            year
                            schoolName
                            typeOfSchool
                            reason
                            educationalRecords {
                              yearDivision
                              quarter
                              semester
                              numberOfSubjects
                              totalMark
                              average
                              semesterGPA
                              cumulativeGPA
                              reportCardUrl
                            }
                          }
                          hobbies
                          house_property {
                            housingSituation
                            otherProperty
                          }
                          sponsorshipStatuses {
                            id
                            status
                            date
                          }
                          guardian {
                            id
                            firstName
                            middleName
                            lastName
                            gender
                            email
                            mobileNumber
                            nationality
                            telephoneNumber
                            dateOfBirth
                            relationToOrphan
                            guardianIDCardUrl
                            guardianConfirmationLetterUrl
                            guardianLegalConfirmationLetterUrl
                          }
                          mother {
                            id
                            firstName
                            middleName
                            lastName
                            dateOfBirth
                            vitalStatus
                            maritalStatus
                          }
                          sponsorshipStatuses {
                            status
                            date
                          }
                          donor {
                            id
                            nameInitials
                          }
                          village {
                            id
                            name
                          }
                        }
                      }`,
              variables: {
                id: id,
              },
            })
            .then((res) => this.orphans.push(res.data.data.orphan))
            .catch((err) => console.warn(err));
        }
      }
    },
    // custom search function based on selected columns
    searchFilter(value, search, item) {
      // console.log(item);
      // console.log(this.filterValue);
      if (search.length > 0) {
        if (this.filterValue.length > 0) {
          for (const filterVal of this.filterValue) {
            if (filterVal === this.headers[0].text) {
              return item.id.indexOf(search) !== -1;
            } else if (filterVal === this.headers[1].text) {
              return (
                item.fullName.toLowerCase().indexOf(search.toLowerCase()) !== -1
              );
            } else if (filterVal === this.headers[2].text) {
              return item.Age.indexOf(search) !== -1;
            } else if (filterVal === this.headers[3].text) {
              return (
                item.gender.toLowerCase().indexOf(search.toLowerCase()) !== -1
              );
            } else if (filterVal === this.headers[4].text) {
              return (
                item.sponsorshipStatus
                  .toLowerCase()
                  .indexOf(search.toLowerCase()) !== -1
              );
            } else {
              return item.sponsoredDate.indexOf(search) !== -1;
            }
          }
        } else {
          return (
            value != null &&
            typeof value === "string" &&
            value
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
    goToCoordinatorTable() {
      this.$emit("onBack", false);
    },
    cancelOrphanChoice() {
      this.orphanShow = false;
      this.orphanPanel = null;
      this.showDonorSelectionDialog = false;
    },
    chooseOrphans() {
      this.orphanShow = true;
      this.orphanSelectBtnLable = "Send Orphans";
      this.orphanPanel = 1;
      this.showDonorSelectionDialog = false;
      console.log("selectedOrphanDonor", this.selectedOrphanDonor);
    },
    async selectOrphans() {
      if (!this.orphanShow || !this.orphanPanel) {
        this.selectedOrphanDonorOptions = await axios
          .post("/graphql/", {
            query: `query {
                    allDonors {
                      id
                      nameInitials
                    }
                  }`,
          })
          .then((res) => res.data.data.allDonors)
          .catch((err) => console.warn(err));
        console.log(
          "selectedOrphanDonorOptions",
          this.selectedOrphanDonorOptions
        );
        this.showDonorSelectionDialog = true;
        this.selectedOrphans = [];
      } else {
        this.showDonorSelectionDialog = false;
        this.orphanSelectBtnLable = "Select Orphans";
        this.orphanPanel = null;

        let donor = this.selectedOrphanDonorOptions.filter(
          (cur) => cur.nameInitials === this.selectedOrphanDonor
        )[0];
        let selectedDonorId = donor.id;
        let orphanIds = this.selectedOrphans.map((orphan) =>
          parseInt(orphan.id)
        );

        let recievedOrphanIds = await axios
          .post("/graphql/", {
            query: `mutation($id: ID!, $orphans: [ID]) {
                  updateDonor(id: $id, orphans: $orphans) {
                    id
                    nameInitials
                    orphans {
                      id
                    }
                  }
                }`,
            variables: {
              id: selectedDonorId,
              orphans: orphanIds,
            },
          })
          .then((res) => res.data.data.updateDonor)
          .catch((err) => console.warn(err));
        console.log("recievedOrphanIds", recievedOrphanIds);
        this.selectedOrphans = [];

        // orphanDonorIds = this.selectedOrphans.reduce((acc, orphan) => {
        //   let key = parseInt(orphan.donor.id);
        //   if (!acc[key]) acc[key] = [];
        //   acc[key].push(parseInt(orphan.id));
        //   return acc;
        // }, {});

        // for (const donorId in orphanDonorIds) {
        //   if (Object.hasOwnProperty.call(orphanDonorIds, donorId)) {
        //     const orphanIds = orphanDonorIds[donorId];
        //     // console.log(`orphanDonorIds[${donorId}]`, orphanIds);
        //     if (this.orphanShow === false) {
        //       let recievedOrphanIds = await axios
        //         .post("/graphql/", {
        //           query: `mutation($id: ID!, $orphans: [ID]) {
        //           updateDonor(id: $id, orphans: $orphans) {
        //             id
        //             nameInitials
        //             orphans {
        //               id
        //             }
        //           }
        //         }`,
        //           variables: {
        //             id: donorId,
        //             orphans: orphanIds,
        //           },
        //         })
        //         .then((res) => res.data.data.updateDonor)
        //         .catch((err) => console.warn(err));
        //       console.log("recievedOrphanIds", recievedOrphanIds);
        //     }
        //   }
        // }
      }
      // this.showDonorSelectionDialog = !this.orphanShow ? true : false;
      // this.selectedOrphans = this.orphanShow ? this.selectedOrphans : [];
      // this.orphanShow = !this.orphanShow;
      // this.orphanSelectBtnLable = this.orphanShow
      //   ? "Send Orphans"
      //   : "Select Orphans";
      // this.orphanPanel = this.orphanShow ? 1 : null;
    },
    changeSponsoredDateHeader() {
      // changeSponsoredDateHeader(header) {
      // console.log("header", header);
      return "Selected Donor";
    },
    displaySelectedOrphanDonor(item) {
      return item.donor ? item.donor.nameInitials : "";
    },
    // old showDetails(item) {
    showDetails(item) {
      this.detailIndex = item.id;
      // this.detailItem = Object.assign({}, item);
      console.log("Show Details", item);
      this.orphanItems.orphanName = item.firstName;
      this.orphanItems.fatherName = item.father.firstName;
      this.orphanItems.grandFatherName = item.father.lastName;
      this.orphanDateOfBirth = item.dateOfBirth;
      this.orphanItems.gender = item.gender;
      this.orphanItems.placeOfBirth = item.placeOfBirth || "N/A";
      this.orphanItems.religion = item.religion || "N/A";
      this.orphanItems.spokenLanguages = item.spokenLanguages || "N/A";
      this.orphanItems.psychologicalStatus = item.psychologicalStatus || "N/A";
      this.orphanHealthDescription = item.healthDescription || "N/A";
      if (item.education !== undefined && item.education !== null) {
        this.orphanItems.enrollmentStatus =
          item.education.enrollmentStatus || "N/A";
        this.orphanItems.educationLevel = item.education.level || "N/A";
        this.orphanItems.educationYearState = item.education.year || "N/A";
        this.orphanItems.schoolType = item.education.typeOfSchool || "N/A";
        this.orphanItems.schoolName = item.education.schoolName || "N/A";
        this.orphanItems.reasonForDropout = item.education.reason || "N/A";
        this.orphanItems.reasonForUnenrolled = item.education.reason || "N/A";
      } else {
        this.orphanItems.enrollmentStatus = "N/A";
        this.orphanItems.educationLevel = "N/A";
        this.orphanItems.educationYearState = "N/A";
        this.orphanItems.schoolType = "N/A";
        this.orphanItems.schoolName = "N/A";
        this.orphanItems.reasonForDropout = "N/A";
        this.orphanItems.reasonForUnenrolled = "N/A";
      }
      this.orphanItems.hobbies = item.hobbies || "N/A";
      if (item.father !== undefined && item.father !== null) {
        this.fatherDateOfBirthDate = item.father.dateOfBirth || "N/A";
        this.fatherDateOfDeathDate = item.father.dateOfDeath || "N/A";
        this.orphanItems.fatherCauseOfDeath = item.father.causeOfDeath || "N/A";
        this.orphanItems.fatherCauseofDeath = item.father.causeOfDeath || "N/A";
      } else {
        this.fatherDateOfBirthDate = "N/A";
        this.fatherDateOfDeathDate = "N/A";
        this.orphanItems.fatherCauseOfDeath = "N/A";
        this.orphanItems.fatherCauseofDeath = "N/A";
      }
      if (item.mother !== undefined && item.mother !== null) {
        this.orphanItems.motherFirstName = item.mother.firstName || "N/A";
        this.orphanItems.motherMiddleName = item.mother.middleName || "N/A";
        this.orphanItems.motherLastName = item.mother.lastName || "N/A";
        this.motherDateOfBirthDate = item.mother.dateOfBirth || "N/A";
        this.orphanItems.motherVitalStatus = item.mother.vitalStatus || "N/A";
        this.orphanItems.motherMaritalStatus =
          item.mother.maritalStatus || "N/A";
      } else {
        this.orphanItems.motherFirstName = "N/A";
        this.orphanItems.motherMiddleName = "N/A";
        this.orphanItems.motherLastName = "N/A";
        this.motherDateOfBirthDate = "N/A";
        this.orphanItems.motherVitalStatus = "N/A";
        this.orphanItems.motherMaritalStatus = "N/A";
      }
      if (item.house_property !== undefined && item.house_property !== null) {
        this.orphanItems.housingSituation =
          item.house_property.housingSituation || "N/A";
        this.orphanItems.otherProperties =
          item.house_property.otherProperties || "N/A";
      } else {
        this.orphanItems.housingSituation = "N/A";
        this.orphanItems.otherProperties = "N/A";
      }
      this.detailDialog = true;
      if (this.orphanItems.enrollmentStatus === "enrolled") {
        console.log("hi");
        this.enrollmentStatusDisplay = "Enrolled";
      } else if (this.orphanItems.enrollmentStatus === "drop-Out") {
        this.enrollmentStatusDisplay = "Dropout";
      } else if (this.orphanItems.enrollmentStatus === "un-enrolled") {
        this.enrollmentStatusDisplay = "Unenrolled";
      }
    },
    // new showDetal
    showDetail(item) {
      this.orphanDetails.id = item.id;
      this.orphanDetails.showOrphanDetail = true;
      console.log("orphanDetals:", this.orphanDetails);
    },
    // *********************************
    orphanDateOfBirthSave(date) {
      // console.log(this.$refs.menu);
      this.$refs.menu.save(date);
    },
    // **********************************
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
    // **********************************
    // Portrait Photo
    togglePortraitPhotoDialog() {
      this.portraitPhotoDialog = !this.portraitPhotoDialog;
    },
    // Education Certificate
    toggleEducationCertificateDialog() {
      this.educationCertificateDialog = !this.educationCertificateDialog;
    },
    // Father Death Certificate
    toggleFatherDeathCertificateDialog() {
      this.fatherDeathCertificateDialog = !this.fatherDeathCertificateDialog;
    },
    // Birth Certificate
    toggleBirthCertificateDialog() {
      this.birthCertificateDialog = !this.birthCertificateDialog;
    },

    // **********************************
    sendTest() {
      // changes the iso 8619 date format to milliseconds since jan 1970
      // let dateOfBirthMilli = Date.parse(this.orphans[0].dateOfBirth.toString());
      // changes the millisecond to date object
      // let dateOfBirth = new Date(dateOfBirthMilli);
      // gets the current date
      // let current = new Date();
      // subtracts current date and that one
      // console.log(current.getUTCFullYear() - dateOfBirth.getUTCFullYear());

      console.log(this.orphans);
    },
  },
};
</script>
