package myProject;



import java.io.Serializable;
import java.time.LocalDate;

public class Transaction implements Serializable {
	private String transactionID;
    private Customer customer;
    private Item item;
    private LocalDate checkOutDate;
    private LocalDate checkInDate;
    private Service service;

    // Constructors
    public Transaction(String transactionID, Customer customer, Item item, LocalDate checkOutDate,
                       LocalDate checkInDate, Service service) {
        this.transactionID = transactionID;
        this.customer = customer;
        this.item = item;
        this.checkOutDate = checkOutDate;
        this.checkInDate = checkInDate;
        this.service = service;
    }

    // Getters and setters
    public String getTransactionID() {
        return transactionID;
    }

    public void setTransactionID(String transactionID) {
        this.transactionID = transactionID;
    }

    public Customer getCustomer() {
        return customer;
    }

    public void setCustomer(Customer customer) {
        this.customer = customer;
    }

    public Item getItem() {
        return item;
    }

    public void setItem(Item item) {
        this.item = item;
    }

    public LocalDate getCheckOutDate() {
        return checkOutDate;
    }

    public void setCheckOutDate(LocalDate checkOutDate) {
        this.checkOutDate = checkOutDate;
    }

    public LocalDate getCheckInDate() {
        return checkInDate;
    }

    public void setCheckInDate(LocalDate checkInDate) {
        this.checkInDate = checkInDate;
    }

    public Service getService() {
        return service;
    }

    public void setService(Service service) {
        this.service = service;
    }

    // toString() method
    @Override
    public String toString() {
        return "Transaction{" +
                "transactionID='" + transactionID + '\'' +
                ", customer=" + customer +
                ", item=" + item +
                ", checkOutDate=" + checkOutDate +
                ", checkInDate=" + checkInDate +
                ", service=" + service +
                '}';
    }
}

