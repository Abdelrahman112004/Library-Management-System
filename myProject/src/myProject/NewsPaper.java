package myProject;



import java.time.LocalDate;

public class NewsPaper extends Item {
    private String issueLanguage;
	private static int counter;
    // Constructors
    public NewsPaper(int ID, String title, Author author, double price, int pages, int dueDays,
                     LocalDate publishingDate, String issueLanguage) {
        super(ID, title, author, price, pages, dueDays, publishingDate);
        counter++;
        this.issueLanguage = issueLanguage;
    }

    public static int getCounter() {
		return counter;
	}

	public static void setCounter(int counter) {
		NewsPaper.counter = counter;
	}

	// Getters and setters
    public String getIssueLanguage() {
        return issueLanguage;
    }

    public void setIssueLanguage(String issueLanguage) {
        this.issueLanguage = issueLanguage;
    }

    // toString() method
    @Override
    public String toString() {
        return "NewsPaper{" +
                "issueLanguage='" + issueLanguage + '\'' +
                "} " + super.toString();
    }
}

