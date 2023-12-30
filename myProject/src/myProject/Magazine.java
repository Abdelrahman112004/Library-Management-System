package myProject;



import java.time.LocalDate;

public class Magazine extends Item {
    private int issueNumber;
	private static int counter;
    // Constructors
    public Magazine(int ID, String title, Author author, double price, int pages, int dueDays,
                    LocalDate publishingDate, int issueNumber) {
        super(ID, title, author, price, pages, dueDays, publishingDate);
        counter++;
        this.issueNumber = issueNumber;
    }

    public static int getCounter() {
		return counter;
	}

	public static void setCounter(int counter) {
		Magazine.counter = counter;
	}

	// Getters and setters
    public int getIssueNumber() {
        return issueNumber;
    }

    public void setIssueNumber(int issueNumber) {
        this.issueNumber = issueNumber;
    }

    // toString() method
    @Override
    public String toString() {
        return "Magazine{" +
                "issueNumber=" + issueNumber +
                "} " + super.toString();
    }
}

