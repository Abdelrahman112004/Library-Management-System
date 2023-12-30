package myProject;



import java.time.LocalDate;

public class ScientificJournal extends Item {
    private String publicationFrequency;
    private double impactFactor;
	private static int counter;
    public static int getCounter() {
		return counter;
	}

	public static void setCounter(int counter) {
		ScientificJournal.counter = counter;
	}

	// Constructors
    public ScientificJournal(int ID, String title, Author author, double price, int pages, int dueDays,
                             LocalDate publishingDate, String publicationFrequency, double impactFactor) {
        super(ID, title, author, price, pages, dueDays, publishingDate);
        this.publicationFrequency = publicationFrequency;
        this.impactFactor = impactFactor;
        counter++;
    }

    // Getters and setters
    public String getPublicationFrequency() {
        return publicationFrequency;
    }

    public void setPublicationFrequency(String publicationFrequency) {
        this.publicationFrequency = publicationFrequency;
    }

    public double getImpactFactor() {
        return impactFactor;
    }

    public void setImpactFactor(double impactFactor) {
        this.impactFactor = impactFactor;
    }

    // toString() method
    @Override
    public String toString() {
        return "ScientificJournal{" +
                "publicationFrequency='" + publicationFrequency + '\'' +
                ", impactFactor=" + impactFactor +
                "} " + super.toString();
    }
}

