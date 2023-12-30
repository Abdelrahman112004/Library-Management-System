package myProject;



import java.io.Serializable;
import java.time.LocalDate;

public class Customer implements Serializable{
	
    private String customerID;
    private String firstName;
    private String lastName;
    private LocalDate dateOfBirth;
    private String address;
    private String phoneNumber;
    private boolean student;

    // Constructors
    public Customer(String customerID, String firstName, String lastName, LocalDate dateOfBirth,
                    String address, String phoneNumber, boolean student) {
        this.customerID = customerID;
        this.firstName = firstName;
        this.lastName = lastName;
        this.dateOfBirth = dateOfBirth;
        this.address = address;
        this.phoneNumber = phoneNumber;
        this.student = student;
    }

    // Getters and setters
    public String getCustomerID() {
        return customerID;
    }

    public void setCustomerID(String customerID) {
        this.customerID = customerID;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public LocalDate getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(LocalDate dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public boolean isStudent() {
        return student;
    }

    public void setStudent(boolean student) {
        this.student = student;
    }
    
    @Override
	public String toString() {
		return "Customer [customerID=" + customerID + ", firstName=" + firstName + ", lastName=" + lastName
				+ ", dateOfBirth=" + dateOfBirth + ", address=" + address + ", phoneNumber=" + phoneNumber
				+ ", student=" + student + "]";
	}
}

