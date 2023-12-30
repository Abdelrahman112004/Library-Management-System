package myProject;



import java.io.Serializable;
import java.time.LocalDate;

public class Book extends Item implements Serializable {
	private String ISBN;
	private String genre;
	private String description;
	private static int counter;
	public static int getCounter() {
		return counter;
	}


	public static void setCounter(int counter) {
		Book.counter = counter;
	}


	// Constructors
	public Book(int ID, String title, Author author,double price, int pages, int dueDays, LocalDate publishingDate,
			String ISBN, String genre, String description) 
	{
		super(ID, title, author, price, pages, dueDays, publishingDate);
		counter++;
		this.ISBN = ISBN;
		this.genre = genre;
		this.description = description;
	}


	// Getters and setters
	public String getISBN() {
		return ISBN;
	}

	public void setISBN(String ISBN) {
		this.ISBN = ISBN;
	}

	public String getGenre() {
		return genre;
	}

	public void setGenre(String genre) {
		this.genre = genre;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	// toString() method
	@Override
	public String toString() {
		return "Book{" +
				"ISBN='" + ISBN + '\'' +
				", genre='" + genre + '\'' +
				", description='" + description + '\'' +
				"} " + super.toString();
	}
}
