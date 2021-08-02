<template>
  <div class="mt-16">
    <v-data-table
      :headers="supportPlanHeaders"
      :items="supportPlans"
      sort-by="id"
      class="elevation-1"
    >
      <template v-slot:item.actions="{ item }">
        <v-icon class="mr-2" @click="openSetInitDateDialog(item)">
          {{ changeGenerateIcon(item) }}
        </v-icon>
        <v-icon
          @click="priviewSupportPlan(item)"
          :disabled="disableSupportPlan(item)"
        >
          mdi-eye
        </v-icon>
        <!-- Edit support plan dialog -->
        <v-dialog v-model="showEditDialog" width="560px">
          <v-card>
            <v-card-title class="justify-center">
              {{
                `Are you sure you want to generate a new 
              Support Plan?`
              }}
            </v-card-title>
            <v-card-text class="text-center">
              This will overright the priviously generated Support Plan.
            </v-card-text>
            <v-card-actions class="justify-center">
              <v-btn class="primary" @click="gotoSetInitDateDialog">Yes</v-btn>
              <v-btn class="error" @click="cancelEditDialog">NO</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </template>
    </v-data-table>

    <!-- InitDate ExchangeRate Dialog -->
    <v-dialog v-model="showSetInitDateDialog" width="40%" persistent>
      <v-card>
        <v-card-title class="justify-center">
          Set Init Date & Exchange Rate
        </v-card-title>
        <v-form ref="setInitDateForm" v-model="validSetInitDateForm">
          <v-row no-gutters>
            <!-- exchange rate field -->
            <v-col cols="6">
              <v-responsive
                min-width="150"
                max-width="150"
                class="pl-0 mx-auto"
              >
                <v-text-field
                  v-model="exchangeRate"
                  type="number"
                  label="Exchange Rate*"
                  hint="exchange rate of foreign currency to Birr"
                  :rules="[rules.required]"
                ></v-text-field>
              </v-responsive>
            </v-col>
            <!-- init date field -->
            <v-col cols="6" class="ml-n5">
              <v-menu
                ref="initDatemenu"
                v-model="initDateMenu"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                min-width="auto"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-responsive
                    min-width="170"
                    max-width="170"
                    class="pl-0 mx-auto"
                  >
                    <v-text-field
                      v-model="initDate"
                      label="InitDate*"
                      prepend-icon="mdi-calendar"
                      hint="start of support plan"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                      :rules="[rules.required]"
                    ></v-text-field>
                  </v-responsive>
                </template>
                <v-date-picker
                  ref="initDatepicker"
                  v-model="initDate"
                  no-title
                  scrollable
                  :max="new Date().toISOString().substr(0, 10)"
                  @change="initDateSave"
                >
                </v-date-picker>
              </v-menu>
            </v-col>
          </v-row>
        </v-form>

        <!-- social worker dialog -->
        <v-dialog v-model="showAssignSocialWorkerDialog" width="40%" persistent>
          <v-card>
            <v-card-title class="justify-center">
              Assign Social Worker for the Sponsored Orphans
            </v-card-title>
            <v-form
              ref="assignSocialWorkerForm"
              v-model="validAssignSocialWorkerForm"
            >
              <v-row no-gutters class="justify-center">
                <v-col cols="9">
                  <v-select
                    v-model="orphanSocialWorker"
                    hint="select social worker for sponsored orphans"
                    :items="orphanSocialWorkerOptions"
                    :menu-props="{ bottom: true, offsetY: true }"
                    solo
                    :rules="[rules.required]"
                    persistent-hint
                    placeholder="SocialWorker"
                  >
                  </v-select>
                </v-col>
              </v-row>
            </v-form>
            <v-card-actions class="justify-end">
              <v-btn text class="red--text" @click="cancelAssignSocialWorker"
                >Cancel</v-btn
              >
              <v-btn
                text
                class="primary--text"
                @click="confirmAssignSocialWorker"
                :disabled="!validAssignSocialWorkerForm"
                >Confirm</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-card-actions class="justify-end">
          <v-btn text class="red--text" @click="cancelSetInitDateExchangeRate"
            >Cancel</v-btn
          >
          <v-btn
            text
            class="primary--text"
            @click="confirmSetInitDateExchangeRate"
            :disabled="!validSetInitDateForm"
            >Confirm</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- support plan orphans dialog -->
    <v-dialog v-model="showSupportPlanOrphansDialog" width="90%" persistent>
      <v-card>
        <v-card-title>
          <v-row>
            <v-col cols="11" class="text-center">
              <span class="ml-16"> Support Plan Id </span>
            </v-col>
            <v-col cols="1">
              <v-icon class="ml-5" @click="closeSupportPlanOrphanDialog"
                >mdi-close</v-icon
              >
            </v-col>
          </v-row>
          <!-- <span class="ml-auto"></span>
          <v-spacer></v-spacer> -->
        </v-card-title>
        <v-card-text>
          <v-data-table
            :headers="supportPlanOrphanHeaders"
            :items="supportPlanOrphans"
          >
            <template v-slot:top="{ items }">
              <v-row class="mt-1 mb-4">
                <v-spacer></v-spacer>
                <v-btn
                  class="primary mr-10"
                  @click="downloadPaymentSheet(items)"
                  >Download</v-btn
                >
              </v-row>
            </template>
            <template v-slot:item.orphanFullName="{ item }">
              {{ orphanFullName(item) }}
            </template>
            <template v-slot:item.guardianFullName="{ item }">
              {{ guardianFullName(item) }}
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import axios from "axios";
import XLSX from "xlsx";
import XLSXStyle from "xlsx-style";
import { saveAs } from "file-saver";

export default {
  data: () => ({
    supportPlans: [],
    supportPlanHeaders: [
      {
        text: "Id",
        align: "start",
        value: "id",
      },
      { text: "Donor", value: "donor.nameInitials" },
      { text: "Currency", value: "foreignCurrency" },
      { text: "Period of Support", value: "supportPeriod" },
      { text: "Number of Orphans", value: "orphans.length" },
      { text: "Admin Fee%", value: "adminFeePercentage" },
      { text: "Actions", value: "actions", sortable: false },
    ],
    rules: {
      required: (value) => !!value || "Required.",
    },
    showSetInitDateDialog: false,
    showAssignSocialWorkerDialog: false,
    showEditDialog: false,
    validSetInitDateForm: false,
    validAssignSocialWorkerForm: false,
    exchangeRate: "",
    initDateMenu: false,
    initDate: "",
    selectedSupportPlan: null,
    showSupportPlanOrphansDialog: false,
    supportPlanOrphans: [],
    supportPlanOrphanHeaders: [
      { text: "Id", align: "start", value: "id" },
      { text: "Orphan Name", value: "orphanFullName" },
      { text: "Guardian Name", value: "guardianFullName" },
      { text: "Account No", value: "accountNumber" },
      { text: "Period", value: "supportPlan.supportPeriod" },
      { text: "Total Fund in FC", value: "supportPlan.individualFund_fc" },
      { text: "Total Fund in Birr", value: "supportPlan.individualFund_brr" },
      { text: "Admin. Fee", value: "supportPlan.adminFee_brr" },
      { text: "Net Payment", value: "supportPlan.netPayment_brr" },
    ],
    supportPlanDonor: "",
    supportPlanInitDate: null,
    supportPlanTermDate: null,
    orphanSocialWorker: null,
    orphanSocialWorkerOptions: [],
    villageIds: [],
    socialWorkers: [],
  }),

  computed: {},

  watch: {
    initDateMenu(val) {
      // Changes the active picker from the default "DATE" to "YEAR"
      val &&
        setTimeout(() => (this.$refs.initDatepicker.activePicker = "YEAR"));
    },
    showSupportPlanOrphansDialog(val) {
      // to update exchangeRate of each support plan until subscription is done on the server side.
      if (val) this.initialize();
    },
  },

  created() {
    this.initialize();
  },

  methods: {
    initialize() {
      axios
        .post("/graphql/", {
          query: `query coordinator($id: ID!) {
                    coordinator(id: $id) {
                      donors {
                        supportPlans {
                          id
                          created_at
                          collectiveFund_fc
                          individualFund_fc
                          foreignCurrency
                          supportPeriod
                          exchangeRate
                          individualFund_brr
                          adminFeePercentage
                          adminFee_brr
                          netPayment_brr
                          initDate
                          termDate
                          orphans{
                            id
                            firstName
                            father {
                              firstName
                              lastName
                            }
                            supportPlan {
                              id
                              created_at
                              collectiveFund_fc
                              individualFund_fc
                              foreignCurrency
                              supportPeriod
                              exchangeRate
                              individualFund_brr
                              adminFee_brr
                              netPayment_brr
                              initDate
                              termDate
                            }
                            accountNumber
                            guardian {
                              id
                              firstName
                              middleName
                              lastName
                            }
                            village {
                              id
                              socialWorker {
                                id
                                firstName
                                middleName
                                lastName
                              }
                            }
                          }
                          donor {
                            id
                            nameInitials
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
          // copies the support plans which are not null
          this.supportPlans = coordinator.donors
            .map((val) => val.supportPlans)
            .reduce((accSupportPlan, supportPlan) => supportPlan && accSupportPlan.concat(supportPlan), []);
        })
        .catch((err) => console.warn(err));
    },

    updateSupportPlan(
      supportPlanId,
      exchangeRate,
      individualFund_brr,
      adminFee_brr,
      netPayment_brr,
      initDate,
      termDate
    ) {
      return axios
        .post("/graphql", {
          query: `mutation updateSupportPlan(
                    $id: ID!
                    $exchangeRate: Float
                    $individualFund_brr: Float
                    $adminFee_brr: Float
                    $netPayment_brr: Float
                    $initDate: DateTime
                    $termDate: DateTime
                  ) {
                    updateSupportPlan(
                      id: $id
                      exchangeRate: $exchangeRate
                      individualFund_brr: $individualFund_brr
                      adminFee_brr: $adminFee_brr
                      netPayment_brr: $netPayment_brr
                      initDate: $initDate
                      termDate: $termDate
                    ) {
                      id
                      donor {
                        nameInitials
                      }
                      initDate
                      termDate
                      orphans {
                        id
                        firstName
                        father {
                          firstName
                          lastName
                        }
                        supportPlan {
                          id
                          created_at
                          collectiveFund_fc
                          individualFund_fc
                          foreignCurrency
                          supportPeriod
                          exchangeRate
                          individualFund_brr
                          adminFee_brr
                          netPayment_brr
                          initDate
                          termDate
                        }
                        accountNumber
                        guardian {
                          id
                          firstName
                          middleName
                          lastName
                        }
                        village {
                          id
                          name
                          socialWorker {
                            id
                          }
                          district {
                            name
                            zone {
                              name
                            }
                          }
                        }
                      }
                    }
                  }`,
          variables: {
            id: parseInt(supportPlanId),
            exchangeRate: parseFloat(exchangeRate),
            individualFund_brr: parseFloat(individualFund_brr),
            adminFee_brr: parseFloat(adminFee_brr),
            netPayment_brr: parseFloat(netPayment_brr),
            initDate: initDate,
            termDate: termDate,
          },
        })
        .then((res) => res.data.data.updateSupportPlan)
        .catch((err) => console.warn(err));
    },

    createSponsorshipStatus(orphanId, status) {
      return axios
        .post("/graphql", {
          query: `mutation createSponsorshipStatus(
                  $status: sponsorshipStatus
                  $date: DateTime!
                  $orphanId: ID
                ) {
                  createSponsorshipStatus(status: $status, date: $date, orphanId: $orphanId) {
                    id
                    status
                    date
                    orphan {
                      id
                    }
                  }
                }`,
          variables: {
            status: status,
            date: new Date().toISOString(),
            orphanId: orphanId,
          },
        })
        .then((res) => res.data.data.createSponsorshipStatus)
        .catch((err) => console.warn(err));
    },

    changeGenerateIcon(item) {
      return !item.exchangeRate ? "mdi-text-box-plus-outline" : "mdi-pencil";
    },

    openSetInitDateDialog(item) {
      this.selectedSupportPlan = item;
      if (!item.exchangeRate) this.showSetInitDateDialog = true;
      else this.showEditDialog = true;
    },

    priviewSupportPlan(item) {
      console.log("priviewSupportPlan", item);
      axios
        .post("/graphql", {
          query: `query supportPlan($id: ID!) {
                  supportPlan(id: $id) {
                    id
                    donor {
                      nameInitials
                    }
                    initDate
                    termDate
                    orphans {
                      id
                      firstName
                      father {
                        firstName
                        lastName
                      }
                      supportPlan {
                        id
                        created_at
                        collectiveFund_fc
                        individualFund_fc
                        foreignCurrency
                        supportPeriod
                        exchangeRate
                        individualFund_brr
                        adminFee_brr
                        netPayment_brr
                        initDate
                        termDate
                      }
                      accountNumber
                      guardian {
                        id
                        firstName
                        middleName
                        lastName
                      }
                      village {
                        name
                        district {
                          name
                          zone {
                            name
                          }
                        }
                      }
                    }
                  }
                }`,
          variables: {
            id: item.id,
          },
        })
        .then((res) => res.data.data.supportPlan)
        .then((supportPlan) => {
          this.supportPlanOrphans = supportPlan.orphans;
          this.supportPlanDonor = supportPlan.donor.nameInitials;
          this.supportPlanInitDate = supportPlan.initDate;
          this.supportPlanTermDate = supportPlan.termDate;
        })
        .catch((err) => console.warn(err));
      this.showSupportPlanOrphansDialog = true;
    },

    disableSupportPlan(item) {
      if (!item.exchangeRate) return true;
      return false;
    },

    gotoSetInitDateDialog() {
      this.showEditDialog = false;
      this.showSetInitDateDialog = true;
    },

    cancelEditDialog() {
      this.showEditDialog = false;
    },

    initDateSave(date) {
      this.$refs.initDatemenu.save(date);
    },

    cancelSetInitDateExchangeRate() {
      this.setInitDateClose();
      this.setInitDateReset();
    },

    confirmSetInitDateExchangeRate() {
      if (this.$refs.setInitDateForm.validate()) {
        for (const orphan of this.selectedSupportPlan.orphans) {
          if (this.villageIds.length === 0) {

            this.socialWorkers = [];
            this.orphanSocialWorkerOptions = [];
          }
          if (this.villageIds.indexOf(orphan.village.id) === -1) {

            this.villageIds.push(orphan.village.id);
            this.socialWorkers.push(orphan.village.socialWorker);
            this.orphanSocialWorkerOptions.push(
              `${orphan.village.socialWorker.firstName} ${orphan.village.socialWorker.middleName} ${orphan.village.socialWorker.lastName}`
            );
          }
        }
        this.setInitDateClose();

        this.showAssignSocialWorkerDialog = true;
      } else {
        // handle error and show some kind of notification
      }
    },

    setInitDateClose() {
      this.showSetInitDateDialog = false;
    },

    setInitDateReset() {
      this.$refs.setInitDateForm.reset();
    },

    cancelAssignSocialWorker() {
      this.setInitDateReset();
      this.assignSocialWorkerClose();
      this.assignSocialWorkerReset();
    },

    async confirmAssignSocialWorker() {
      if (this.$refs.assignSocialWorkerForm.validate()) {
        // check the validity of the fund by like comparing the sum of individual with the collective fund in FC
        const individualFund_brr =
          this.selectedSupportPlan.individualFund_fc * this.exchangeRate;
        const adminFee_brr = individualFund_brr * 0.05;
        const netPayment_brr = individualFund_brr - adminFee_brr;
        const inputDate = new Date(this.initDate);
        const initDate = inputDate.toISOString();
        const termDate = new Date(
          inputDate.setMonth(
            inputDate.getMonth() + this.selectedSupportPlan.supportPeriod
          )
        ).toISOString();

        const updatedSupportPlan = await this.updateSupportPlan(
          this.selectedSupportPlan.id,
          this.exchangeRate,
          individualFund_brr,
          adminFee_brr,
          netPayment_brr,
          initDate,
          termDate
        );

        this.supportPlanOrphans = updatedSupportPlan.orphans;
        this.supportPlanDonor = updatedSupportPlan.donor.nameInitials;
        this.supportPlanInitDate = updatedSupportPlan.initDate;
        this.supportPlanTermDate = updatedSupportPlan.termDate;

        for (const orphan of updatedSupportPlan.orphans) {
          const sponsorshipStatus = await this.createSponsorshipStatus(
            orphan.id,
            "active"
          );
          console.log(`sponsorshipStatus`, sponsorshipStatus);

          const socialWorker = this.socialWorkers.filter(
            (socialWorker) =>
              this.orphanSocialWorker ===
              `${socialWorker.firstName} ${socialWorker.middleName} ${socialWorker.lastName}`
          )[0];

          const assignedSocialWorker = await this.updateOrphan(
            orphan.id,
            socialWorker.id
          );
          console.log(`assignedSocialWorker`, assignedSocialWorker.socialWorker);
        }
        this.showSupportPlanOrphansDialog = true;

        this.setInitDateReset();
        this.assignSocialWorkerClose();
        this.assignSocialWorkerReset();
      }
    },

    assignSocialWorkerClose() {
      this.showAssignSocialWorkerDialog = false;
    },

    assignSocialWorkerReset() {
      this.$refs.assignSocialWorkerForm.reset();
    },

    updateOrphan(orphanId, socialWorkerId) {
      let query = `mutation updateOrphan(
        $id: ID!
        $socialWorkerId: ID
      ) {
        updateOrphan(
          id: $id
          socialWorkerId: $socialWorkerId
        ) {
          id
          socialWorker {
            id
            firstName
            middleName
            lastName
          }
        }
      }`;

      let variables = {
        id: orphanId,
        socialWorkerId: socialWorkerId,
      };

      return axios
        .post("/graphql/", {
          query: query,
          variables: variables,
        })
        .then((res) => res.data.data.updateOrphan)
        .catch((err) => console.warn(err));
    },

    orphanFullName(item) {
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

    guardianFullName(item) {
      if (!item.guardian) {
        return "N/A";
      } else {
        return (
          `${item.guardian.firstName
            .substr(0, 1)
            .toUpperCase()}${item.guardian.firstName.substr(1)}` +
          ` ${item.guardian.middleName
            .substr(0, 1)
            .toUpperCase()}${item.guardian.middleName.substr(1)}` +
          ` ${item.guardian.lastName
            .substr(0, 1)
            .toUpperCase()}${item.guardian.lastName.substr(1)}`
        );
      }
    },

    downloadPaymentSheet(supportedOrphans) {
      // console.log(supportedOrphans);
      const projectNo = 7,
        agencyName = this.supportPlanDonor,
        initDate = new Date(this.supportPlanInitDate).toDateString(),
        termDate = new Date(this.supportPlanTermDate).toDateString(),
        zoneName = supportedOrphans[0].village.district.zone.name,
        districtName = supportedOrphans[0].village.district.name,
        villageName = supportedOrphans[0].village.name;

      let jsonExportData = [
        [
          "Charity and Development Association (CDA)",
          null,
          null,
          null,
          null,
          null,
          null,
          null,
        ],
        [
          `Payment Sheet For Orphans Project ${projectNo}`,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
        ],
        [
          `Funding Agency: ${agencyName}`,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
        ],
        [
          "Cooperative Bank of Oromia Adaba Branch",
          null,
          null,
          null,
          null,
          null,
          null,
          null,
        ],
        [
          `Payment Period From ${initDate} - ${termDate}`,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
        ],
        [
          `Zone: ${zoneName}`,
          null,
          `District: ${districtName}`,
          null,
          `Village: ${villageName}`,
          null,
          "Date___________",
          null,
        ],
        [
          "Orphan Name",
          "Guardian Name",
          "Account No",
          "Period",
          "Total Fund in GBP",
          "Total Fund in Birr",
          "Admin. Fee",
          "Net Payment",
        ],
      ];

      const modifiedSupportPlanOrphans = supportedOrphans.map((orphan) => {
        let modifiedOrphansArray = [];
        if (Object.hasOwnProperty.call(orphan, "father")) {
          modifiedOrphansArray[0] = `${orphan.firstName} ${orphan.father?.firstName} ${orphan.father?.lastName}`;
        }
        if (Object.hasOwnProperty.call(orphan, "guardian")) {
          modifiedOrphansArray[1] = `${orphan.guardian?.firstName} ${orphan.guardian?.middleName} ${orphan.guardian?.lastName}`;
        }
        if (Object.hasOwnProperty.call(orphan, "accountNumber")) {
          modifiedOrphansArray[2] = orphan.accountNumber;
        }
        if (Object.hasOwnProperty.call(orphan, "supportPlan")) {
          modifiedOrphansArray[3] = orphan.supportPlan.supportPeriod;
          modifiedOrphansArray[4] = orphan.supportPlan.individualFund_fc;
          modifiedOrphansArray[5] = orphan.supportPlan.individualFund_brr;
          modifiedOrphansArray[6] = orphan.supportPlan.adminFee_brr;
          modifiedOrphansArray[7] = orphan.supportPlan.netPayment_brr;
        }
        return modifiedOrphansArray;
      });

      jsonExportData.push(...modifiedSupportPlanOrphans);

      const workBook = XLSX.utils.book_new();
      const workSheet = XLSX.utils.aoa_to_sheet(jsonExportData);

      // handle merge
      workSheet["!merges"] = [
        { s: { r: 0, c: 0 }, e: { r: 0, c: 7 } },
        { s: { r: 1, c: 0 }, e: { r: 1, c: 7 } },
        { s: { r: 2, c: 0 }, e: { r: 2, c: 7 } },
        { s: { r: 3, c: 0 }, e: { r: 3, c: 7 } },
        { s: { r: 4, c: 0 }, e: { r: 4, c: 7 } },
        // { s: { r: 5, c: 0 }, e: { r: 5, c: 1 } },
        { s: { r: 5, c: 2 }, e: { r: 5, c: 3 } },
        { s: { r: 5, c: 4 }, e: { r: 5, c: 5 } },
        { s: { r: 5, c: 6 }, e: { r: 5, c: 7 } },
      ];

      // sets the width of colns
      workSheet["!cols"] = [
        { wpx: 150 },
        { wpx: 150 },
        { wpx: 100 },
        { wpx: 40 },
        { wpx: 70 },
        { wpx: 70 },
        { wpx: 70 },
        { wpx: 70 },
      ];

      // sets the first 5 rows bold and centered
      for (let i = 1; i <= 5; i++) {
        workSheet[`A${i}`].s = {
          font: {
            bold: true,
          },
          alignment: {
            horizontal: "center",
            vertical: "center",
          },
        };
      }

      // sets the 6th row elments to bold
      for (let i = 0; i <= 6; i += 2) {
        const char = String.fromCharCode(65 + i);
        workSheet[`${char}6`].s = {
          font: {
            bold: true,
          },
        };
      }

      // sets border to the table
      for (const key in workSheet) {
        const flag = key.localeCompare("A8", undefined, { numeric: true });
        if (flag < 0 || key === "C6" || key === "E6" || key === "G6") continue;
        workSheet[key].s = {
          alignment: {
            horizontal: "center",
            wrapText: true,
          },
          border: {
            top: {
              style: "thin",
              color: "000000",
            },
            bottom: {
              style: "thin",
              color: "000000",
            },
            left: {
              style: "thin",
              color: "000000",
            },
            right: {
              style: "thin",
              color: "000000",
            },
          },
        };
      }

      // sets the 7th row to bold and text-wrap
      for (let i = 0; i <= 7; i++) {
        const char = String.fromCharCode(65 + i);
        workSheet[`${char}7`].s = {
          font: {
            bold: true,
          },
          alignment: {
            horizontal: "center",
            vertical: "center",
            wrapText: true,
          },
          border: {
            top: {
              style: "thin",
              color: "000000",
            },
            bottom: {
              style: "thin",
              color: "000000",
            },
            left: {
              style: "thin",
              color: "000000",
            },
            right: {
              style: "thin",
              color: "000000",
            },
          },
        };
      }

      // sets the text rotaion of D7 cell
      Object.assign(workSheet["D7"].s, {
        alignment: {
          horizontal: "center",
          vertical: "center",
          textRotation: 90,
        },
      });

      // creates an output buffer
      function s2ab(s) {
        if (typeof ArrayBuffer !== "undefined") {
          const buf = new ArrayBuffer(s.length);
          const view = new Uint8Array(buf);
          for (let i = 0; i !== s.length; ++i) {
            view[i] = s.charCodeAt(i) & 0xff;
          }
          return buf;
        } else {
          const buf = new Array(s.length);
          for (let i = 0; i !== s.length; ++i) {
            buf[i] = s.charCodeAt(i) & 0xff;
          }
          return buf;
        }
      }

      XLSX.utils.book_append_sheet(workBook, workSheet, "Orphan Payment Sheet");

      // XLSX.writeFile(workBook, "orphanTest.xlsx");
      const wbOut = XLSXStyle.write(workBook, {
        bookSST: false,
        type: "binary",
      });

      saveAs(new Blob([s2ab(wbOut)], { type: "" }), "OrphanPaymentSheet.xlsx");

      // console.log(jsonExportData);
    },

    closeSupportPlanOrphanDialog() {
      this.showSupportPlanOrphansDialog = false;
    },

    close() {
      // this.dialog = false;
      // this.$nextTick(() => {
      //   this.editedItem = Object.assign({}, this.defaultItem);
      //   this.editedIndex = -1;
      // });
    },

    save() {
      // if (this.editedIndex > -1) {
      //   Object.assign(this.desserts[this.editedIndex], this.editedItem);
      // } else {
      //   this.desserts.push(this.editedItem);
      // }
      // this.close();
    },
  },
};
</script>
