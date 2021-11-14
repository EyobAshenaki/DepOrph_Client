<template>
  <v-dialog
    v-model="isOpen"
    :retain-focus="false"
    max-width="768"
    overlay-color="#000"
    overlay-opacity=".3"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn color="primary" v-bind="attrs" v-on="on">New Record</v-btn>
    </template>
    <v-card>
      <v-card-title primary-title>
        New Financial Record
      </v-card-title>
      <v-card-text>
        <v-form
          ref="newFinancialRecordForm"
          v-model="validForm"
          lazy-validation
        >
          <v-container>
            <v-row>
              <v-col
                ><v-text-field
                  label="Amount"
                  v-model="amount"
                  :rules="[rules.required, rules.numberAboveZero]"
                ></v-text-field
              ></v-col>
              <v-col
                ><v-select
                  label="Type"
                  :items="transactionTypeOptions"
                  v-model="type"
                  :rules="[rules.required]"
                ></v-select
              ></v-col>
            </v-row>
            <v-row>
              <v-col
                ><v-select
                  label="Reason"
                  :items="transactionReasonOptions"
                  v-model="reason"
                  :rules="[rules.required]"
                ></v-select
              ></v-col>
              <v-col
                ><v-text-field
                  type="date"
                  label="Date"
                  v-model="date"
                  :rules="[rules.required]"
                ></v-text-field
              ></v-col>
            </v-row>
            <v-row v-if="reason == 'SCW'"
              ><v-col
                ><v-textarea
                  label="Special Case Reason"
                  v-model="specialCaseReason"
                ></v-textarea></v-col
            ></v-row>
          </v-container>
        </v-form>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="closeInsertFinancialRecordDialog" color="#eee"
          >Cancel</v-btn
        >
        <v-btn @click="saveInsertFinancialRecordDialog" color="primary"
          >Save</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import moment from "moment";
import axios from "axios";
export default {
  props: ["open", "orphanId"],
  data: () => ({
    isOpen: false,
    validForm: false,
    rules: {
      required: value => !!value || "Required.",
      numberAboveZero: value => {
        return (
          (typeof parseFloat(value) === "number" && value > 0) ||
          "Value must be a number above 0."
        );
      }
    },
    transactionTypeOptions: [
      { text: "Withdrawal", value: "withdrawal" },
      { text: "Deposit", value: "deposit" }
    ],
    transactionReasonOptions: [
      { text: "Educational materials withdrawal", value: "EW" },
      { text: "Health support withdrawal", value: "HW" },
      {
        text: "Necessities withdrawal (food, clothes, rent, ...)",
        value: "NW"
      },
      { text: "Special case withdrawal", value: "SCW" }
    ],
    amount: "",
    type: "",
    date: "",
    reason: "",
    specialCaseReason: ""
  }),
  methods: {
    closeInsertFinancialRecordDialog() {
      this.isOpen = false;
    },
    saveInsertFinancialRecordDialog() {
      if (this.$refs.newFinancialRecordForm.validate()) {
        const {
          amount,
          type,
          date,
          reason,
          specialCaseReason,
          orphanId
        } = this;
        const query = `
      mutation(
        $date: DateTime!
        $type: FRTransactionType!
        $amount: Float!
        $reason: FRReason!
        $specialCaseReason: String
        $orphanId: ID!
      ){
        createFinancialRecord(
          transactionDate: $date
          transactionType: $type
          amount: $amount
          reason: $reason
          specialCaseReason: $specialCaseReason
          orphanId: $orphanId
          ){
            __typename
           }
        }`;
        const queryOptions = {
          query,
          variables: {
            date: moment(date).toISOString(),
            type,
            amount: parseFloat(amount),
            reason,
            specialCaseReason,
            orphanId
          }
        };
        (async () => {
          await axios.post("/graphql", queryOptions);
          this.$emit("newRecordSaved");
          this.isOpen = false;
          this.$refs.newFinancialRecordForm.reset();
        })();
      }
    }
  }
};
</script>

<style></style>
