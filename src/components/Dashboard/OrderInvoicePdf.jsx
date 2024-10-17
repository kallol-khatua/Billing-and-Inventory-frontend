/* eslint-disable react/prop-types */
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";

// Define styles for the PDF using StyleSheet.create
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12,
    fontFamily: "Helvetica",
  },
  section: {
    marginBottom: 10,
    display: "flex",
    flexDirection: "column",
    gap: "4px"
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  table: {
    display: "flex",
    flexDirection: "row",
    borderBottom: "1px solid #000",
    paddingBottom: 8,
    marginBottom: 8,
  },
  tableHeader: {
    fontWeight: "bold",
  },
  tableRow: {
    flexDirection: "row",
    borderBottom: "1px solid #eee",
    paddingVertical: 4,
  },
  tableCol: {
    width: "25%",
    textAlign: "center",
  },
  totals: {
    flexDirection: "column",
    alignItems: "flex-end",
    marginTop: 20,
  },
  totalRow: {
    width: "50%",
    flexDirection: "row",
    justifyContent: "space-between",
    borderTop: "1px solid #000",
    paddingTop: 4,
    marginTop: 4,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
});

function OrderInvoicePdf({ orderDetails }) {
  const getFormatedDate = (dateTimeString) => {
    // Create a Date object from the string
    const date = new Date(dateTimeString);

    // Format the date using Intl.DateTimeFormat
    const options = {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    };

    const formattedDate = new Intl.DateTimeFormat("en-US", options).format(
      date
    );

    return formattedDate;
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Invoice Header */}
        <View style={styles.section}>
          <Text style={styles.header}>Order Invoice</Text>
        </View>

        {/* Billing Information */}
        <View style={styles.section}>
          <Text>
            <Text style={{ fontWeight: "bold" }}>Bill To: </Text>
            {orderDetails.customerName}
          </Text>
          <Text>
            <Text style={{ fontWeight: "bold" }}>Order ID: </Text>
            {orderDetails.orderId}
          </Text>
          <Text>
            <Text style={{ fontWeight: "bold" }}>Order Date: </Text>
            {getFormatedDate(orderDetails.createdAt)}
          </Text>
        </View>

        {/* Product List Table */}
        <View style={styles.table}>
          <Text style={[styles.tableCol, styles.tableHeader]}>Product</Text>
          <Text style={[styles.tableCol, styles.tableHeader]}>Quantity</Text>
          <Text style={[styles.tableCol, styles.tableHeader]}>Price</Text>
          <Text style={[styles.tableCol, styles.tableHeader]}>Total</Text>
        </View>

        {orderDetails.orderItems.map((product, index) => (
          <View key={index} style={styles.tableRow}>
            <Text style={styles.tableCol}>{product.productName}</Text>
            <Text style={styles.tableCol}>{product.orderQuantity}</Text>
            <Text style={styles.tableCol}>
              {product.productPrice.toFixed(2)}
            </Text>
            <Text style={styles.tableCol}>{product.totalPrice.toFixed(2)}</Text>
          </View>
        ))}

        {/* Totals Section */}
        <View style={styles.totals}>
          <View style={styles.totalRow}>
            <Text style={{ fontWeight: "bold" }}>Subtotal:</Text>
            <Text>{orderDetails.totalAmount.toFixed(2)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={{ fontWeight: "bold" }}>Grand Total:</Text>
            <Text>{orderDetails.totalAmount.toFixed(2)}</Text>
          </View>
        </View>

        {/* Order Status and Payment Mode */}
        <View style={styles.footer}>
          <Text>
            <Text style={{ fontWeight: "bold" }}>Order Status: </Text>
            {orderDetails.orderStatus}
          </Text>
          <Text>
            <Text style={{ fontWeight: "bold" }}>Payment Mode: </Text>
            {orderDetails.paymentMode}
          </Text>
        </View>
      </Page>
    </Document>
  );
}

export default OrderInvoicePdf;
