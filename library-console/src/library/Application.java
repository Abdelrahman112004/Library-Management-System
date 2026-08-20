package library;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Scanner;
import java.util.concurrent.atomic.AtomicInteger;

import java.io.*;


public class Application implements Serializable {
	// One Scanner for the whole program. Creating a new Scanner per method
	// makes each one buffer ahead and swallow input the next one needed.
	//
	// Locale.ROOT forces "10.5" to parse as a decimal. Scanner otherwise
	// follows the JVM format locale, which on some Windows regions expects a
	// different decimal separator and throws InputMismatchException instead.
	private static final Scanner SCANNER = new Scanner(System.in).useLocale(java.util.Locale.ROOT);

	private static ArrayList<Item> items = new ArrayList<Item>();
	private static ArrayList<Author> authors =  new ArrayList<Author>();
	private static ArrayList<Customer> customers = new ArrayList<Customer>();
	private static ArrayList<Transaction> transactions = new ArrayList<Transaction>();

	public static void main(String[] args) {
		loadItemsFromFile();


		Scanner scanner = SCANNER;

		int choice;
		do {
			displayMenu();
			System.out.print("Enter your choice: ");
			choice = scanner.nextInt();
			scanner.nextLine(); // Consume the rest of the menu-choice line

			switch (choice) {
			case 1:
				addNewItem();
				break;
			case 2:
				updateExistingItem();
				break;
			case 3:
				deleteExistingItem();
				break;
			case 4:
				addcustomer();
				break;
			case 5:
				Scanner input = SCANNER;
				System.out.println("Enter customer id ");
				String id=input.nextLine();
				updateExistingCustomer(id);
				break;
			case 6:
				Scanner input3 = SCANNER;
				System.out.println("Enter customer id");
				String delete = input3.nextLine();
				deleteExistingcustomer(delete);
				break;
			case 7:
				System.out.println("Enter customer id ");
				Scanner enter = SCANNER;
				String cuId = enter.nextLine();

				System.out.println("item id ");
				int itid=enter.nextInt();
				enter.nextLine(); // Consume the newline before the service prompts
				borrowTransaction(cuId, itid);

				break;
			case 8:
				System.out.println("Enter id to return the book: ");
				Scanner input1 = SCANNER;
				String id1 = input1.nextLine();
				returnTransaction(id1);
				break;
			case 9:
				
				System.out.println("Enter customer id: ");
				Scanner inputcs = SCANNER;
				String cusid = inputcs.nextLine();
				ListItemsnotyetreturned(cusid);
				break;
			case 10:
				System.out.println("Enter last name: ");
				Scanner inputname = SCANNER;
				String lastname = inputname.nextLine();
				listAllAuthorPublications(lastname);
				break;
			case 11:
				saveAndExit();
				break;
			default:
				System.out.println("Invalid choice. Please try again.");
			}
		} while (choice != 11);

	}

	//private static AtomicInteger itemIdGenerator = new AtomicInteger(0);
	
	public Application() {
		this.items = new ArrayList<>();
		this.authors = new ArrayList<>();
		this.customers = new ArrayList<>();
		this.transactions = new ArrayList<>();
	}
	public Application(ArrayList<Item> items, ArrayList<Author> authors, ArrayList<Customer> customers,
			ArrayList<Transaction> transactions, AtomicInteger itemIdGenerator) {
		super();
		this.items = items;
		this.authors = authors;
		this.customers = customers;
		this.transactions = transactions;
	}
	public ArrayList<Item> getItems() {
		return items;
	}
	public void setItems(ArrayList<Item> items) {
		this.items = items;
	}
	public ArrayList<Author> getAuthors() {
		return authors;
	}
	public void setAuthors(ArrayList<Author> authors) {
		this.authors = authors;
	}
	public ArrayList<Customer> getCustomers() {
		return customers;
	}
	public void setCustomers(ArrayList<Customer> customers) {
		this.customers = customers;
	}
	public ArrayList<Transaction> getTransactions() {
		return transactions;
	}
	public void setTransactions(ArrayList<Transaction> transactions) {
		this.transactions = transactions;
	}


	public void saveTransactionsToFile(String fileName) {
		try (ObjectOutputStream outputStream = new ObjectOutputStream(new FileOutputStream(fileName))) {
			outputStream.writeObject(transactions);
			System.out.println("Transactions saved to file: " + fileName);
		} catch (IOException e) {
			System.err.println("Error saving transactions to file: " + e.getMessage());
		}
	}
	public void loadTransactionsFromFile(String fileName) {
		try (ObjectInputStream inputStream = new ObjectInputStream(new FileInputStream(fileName))) {
			transactions = (ArrayList<Transaction>) inputStream.readObject();
			System.out.println("Transactions loaded from file: " + fileName);
		} catch (IOException | ClassNotFoundException e) {
			System.err.println("Error loading transactions from file: " + e.getMessage());
		}
	}


	private static void displayMenu() {
		System.out.println("Main Menu:");
		System.out.println("1- Add New Item. ➔ Book, Scientific Journal, Magazine, or News Paper.");
		System.out.println("2- Update Existing Item. ➔ Search by title.");
		System.out.println("3- Delete Existing Item. ➔ Search by title.");
		System.out.println("4- Add New Customer.");
		System.out.println("5- Update Existing Customer. ➔ Search by Customer ID.");
		System.out.println("6- Delete Existing Customer. ➔ Search by Customer ID.");
		System.out.println("7- Borrow Transaction. ➔ Check the details below.");
		System.out.println("8- Return Transaction. ➔ Check the details below.");
		System.out.println("9- List of Items Not Yet Returned.");
		System.out.println("10- List All Author Publications. ➔ Search by author last name.");
		System.out.println("11- Save and Exit.");
	}
	
	public static int generateUniqueItemID() {
		int itemid = 1;

	    while (true) {
	        Item check = findItemById(itemid);

	        if (check == null) {
	            return itemid;  // unique customer id
	        }

	        itemid++;
	    }
	}
	public static void addNewItem() {
		int itemId = generateUniqueItemID();
		Scanner scanner = SCANNER;
		System.out.println("Enter the number of the Item that you would like to add (1-4): \n1. Add a new Book \n2. Add a new Scientific journal"
				+ "\n 3. Add a new Magazine \n4. Add a new NewsPaper f");

		System.out.print("Enter your choice: ");
		int choice = scanner.nextInt();
		scanner.nextLine(); // Consume the newline character

		String itemChoice = null;
		if (choice == 1) {
			itemChoice = "Book";
		} else if (choice == 2) {
			itemChoice = "Scientific Journal";
		} else if (choice == 3) {
			itemChoice = "Magazine";
		} else if (choice == 4) {
			itemChoice = "NewsPaper";
		} else {
			System.out.println("Invalid Choice, please try again");
			return; // Add this return statement to exit the method if the choice is invalid
		}


		System.out.printf("Enter the %s title:\n", itemChoice);
		String title = scanner.nextLine();

		System.out.println("Enter the author's first name: ");
		String firstName = scanner.nextLine();

		System.out.println("Enter the author's last name: ");
		String lastName = scanner.nextLine();

		System.out.println("Enter the author's date of birth (YYYY-MM-DD): ");
		String dateOfBirthStr = scanner.next();
		LocalDate dateOfBirth = LocalDate.parse(dateOfBirthStr);

		Author author = new Author(firstName, lastName, dateOfBirth);

		System.out.printf("Enter the price of the %s: ", itemChoice);
		double price = scanner.nextDouble();
		scanner.nextLine(); 

		System.out.printf("Enter the number of pages in the %s: ", itemChoice);
		int pages = scanner.nextInt();
		scanner.nextLine();

		System.out.printf("Enter the due days for the %s: ", itemChoice);
		int dueDays = scanner.nextInt();
		scanner.nextLine();

		System.out.printf("Enter the publishing date of the %s (YYYY-MM-DD): ", itemChoice);
		String publishingDateStr = scanner.nextLine();
		LocalDate publishingDate = LocalDate.parse(publishingDateStr);

		if (choice == 1) {
			System.out.printf("Enter the ISBN of the book: ");
			String isbn = scanner.nextLine();

			System.out.print("Enter the genre of the book: ");
			String genre = scanner.nextLine();

			System.out.print("Enter a brief description or summary of the book: ");
			String description = scanner.nextLine();

			Book book = new Book(itemId, title, author, price, pages, dueDays, publishingDate, isbn, genre, description);
			addNewItem(book);
			System.out.println("Book added successfully!");
			System.out.println("item id: "+itemId);

		} else if (choice == 2) {
			System.out.println("Please enter the publication frequency of the Scientific journal: ");
			String publicationFrequency = scanner.nextLine();

			System.out.println("Please enter the impact factor of the Scientific journal: ");
			String impactFactorstr = scanner.nextLine();
			double impactFactor = Double.parseDouble(impactFactorstr);

			ScientificJournal journal = new ScientificJournal(itemId, title, author, price, pages, dueDays, publishingDate, publicationFrequency, impactFactor);
			addNewItem(journal);
			System.out.println("Journal added successfully!");
			System.out.println("item id: "+itemId);

		} else if (choice == 3) {
			System.out.println("Please enter the issue number of the magazine: ");
			String issueNumberstr = scanner.nextLine();
			int issueNumber = Integer.parseInt(issueNumberstr);

			Magazine magazine = new Magazine(itemId, title, author, price, pages, dueDays, publishingDate, issueNumber);
			addNewItem(magazine);
			System.out.println("Magazine added successfully!");
			System.out.println("item id: "+itemId);

		} else if (choice == 4) {
			System.out.println("Please enter the issue language of the newspaper: ");
			String issueLanguage = scanner.nextLine();

			NewsPaper newspaper = new NewsPaper(itemId, title, author, price, pages, dueDays, publishingDate, issueLanguage);
			addNewItem(newspaper);

			System.out.println("Newspaper added successfully!");
			System.out.println("item id: "+itemId);
		}
		saveItemsToFile();
	}
	public static void addNewItem(Item newItem) {
		if (!items.contains(newItem)) {
			items.add(newItem);

			if (newItem instanceof Book) {
				Author bookAuthor = ((Book) newItem).getAuthor();
				if (!authors.contains(bookAuthor)) {
					authors.add(bookAuthor);
				}
			} else if (newItem instanceof ScientificJournal) {
			} else if (newItem instanceof Magazine) {
			} else if (newItem instanceof NewsPaper) {
			}

			System.out.println("Item added successfully!");
		} else {
			System.out.println("Item already exists in the library.");
		}
	}
	private static void updateExistingItem() {
		Scanner scanner = SCANNER;

		System.out.println("Choose the item type to update:");
		System.out.println("1. Book");
		System.out.println("2. Scientific Journal");
		System.out.println("3. Magazine");
		System.out.println("4. Newspaper");

		System.out.print("Enter your choice: ");
		int itemTypeChoice = scanner.nextInt();
		scanner.nextLine();

		System.out.println("Enter the title of the %s you would like to update: "+itemTypeChoice);
		String title = scanner.nextLine();               

		if (itemTypeChoice == 1) {

			updateBook(title);

		}else if(itemTypeChoice == 2) {
			updateScientificJournal(title);

		}else if(itemTypeChoice == 3) {
			updateMagazine(title);
		}else if (itemTypeChoice == 4) {
			updateNewspaper(title);
		}else {
			System.out.println("invalid input");
		}
		System.out.println("item updated successfully!");
	}

	public static boolean deleteItemByTitle(String title) {
		// Iterator.remove() avoids the ConcurrentModificationException that
		// removing from the list inside a for-each would raise.
		java.util.Iterator<Item> it = items.iterator();
		while (it.hasNext()) {
			Item item = it.next();
			if (item.getTitle().trim().equalsIgnoreCase(title.trim())) {
				it.remove();
				saveItemsToFile();
				return true;
			}
		}
		return false;
	}
	private static void deleteExistingItem() {
		Scanner scanner = SCANNER;

		displayAllItems();

		System.out.println("Enter the title of the item you want to delete: ");
		String titleToDelete = scanner.nextLine();

		boolean deleted = deleteItemByTitle(titleToDelete);

		if (deleted) {
			System.out.println("Item deleted successfully!");
		} else {
			System.out.println("Item not found. Deletion failed.");
		}
	}


	public static void saveItemsToFile() {
		// Overwrite rather than append: appending a second stream header to an
		// existing file corrupts it, and re-writing every item duplicates them.
		try (ObjectOutputStream objout = new ObjectOutputStream(new FileOutputStream("items.txt"))) {
			objout.writeObject(items);
			System.out.println("Items saved to file successfully!");
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	@SuppressWarnings("unchecked")
	public static void loadItemsFromFile() {
		items = new ArrayList<>();

		try (ObjectInputStream objin = new ObjectInputStream(new FileInputStream("items.txt"))) {
			Object obj = objin.readObject();
			if (obj instanceof ArrayList) {
				items = (ArrayList<Item>) obj;
			}
			System.out.println("Items loaded from file successfully!");
		} catch (FileNotFoundException e) {
			System.out.println("No existing item data found");
		} catch (IOException | ClassNotFoundException e) {
			System.out.println("Could not read items file: " + e.getMessage());
		}
	}

	public static Item findItemByTitle(String title) {
		for (Item item : items) {
			if (item.getTitle().trim().equalsIgnoreCase(title.trim())) {
				return item;
			}
		}
		return null;
	}
	public static void updateTitle(Item item) {
		Scanner scanner = SCANNER;
		System.out.print("Enter the new title: ");
		String newTitle = scanner.nextLine();
		item.setTitle(newTitle);
		System.out.println("Title updated successfully!");
	}
	// Note: none of these close their Scanner. Closing a Scanner wrapping
	// System.in closes stdin for the whole program, so every later prompt
	// would fail with NoSuchElementException.
	public static void updateAuthorFirstName(Item item) {
		Scanner scanner = SCANNER;
		System.out.print("Enter the new author's first name: ");
		String newFirstName = scanner.nextLine();
		item.getAuthor().setFirstName(newFirstName);
		System.out.println("Author's first name updated successfully!");
	}
	public static void updateAuthorLastName(Item item) {
		Scanner scanner = SCANNER;
		System.out.print("Enter the new author's last name: ");
		String newLastName = scanner.nextLine();
		item.getAuthor().setLastName(newLastName);
		System.out.println("Author's last name updated successfully!");
	}
	public static void updateAuthorDOB(Item item) {
		Scanner scanner = SCANNER;
		System.out.print("Enter the new author's date of birth (YYYY-MM-DD): ");
		String newDateOfBirthStr = scanner.nextLine();
		LocalDate newDateOfBirth = LocalDate.parse(newDateOfBirthStr);
		item.getAuthor().setDateOfBirth(newDateOfBirth);
		System.out.println("Author's date of birth updated successfully!");
	}
	public static void updatePrice(Item item) {
		Scanner scanner = SCANNER;
		System.out.print("Enter the new price: ");
		double newPrice = scanner.nextDouble();
		item.setPrice(newPrice);
		System.out.println("Price updated successfully!");
	}
	public static void updatePages(Item item) {
		Scanner scanner = SCANNER;
		System.out.print("Enter the new number of pages: ");
		int newPages = scanner.nextInt();
		item.setPages(newPages);
		System.out.println("Number of Pages updated successfully!");
	}
	public static void updateDueDays(Item item) {
		Scanner scanner = SCANNER;
		System.out.print("Enter the new due days: ");
		int newDueDays = scanner.nextInt();
		item.setDueDays(newDueDays);
		System.out.println("Due days updated successfully!");
	}
	public static void updatePublishingDate(Item item) {
		Scanner scanner = SCANNER;
		System.out.print("Enter the new publishing date (YYYY-MM-DD): ");
		String newPublishingDateStr = scanner.nextLine();
		LocalDate newPublishingDate = LocalDate.parse(newPublishingDateStr);
		item.setPublishingDate(newPublishingDate);
		System.out.println("Publishing date updated successfully!");
	}
	public static void updateItem(Item item, int choice) {
		switch (choice) {
		case 1:
			updateTitle(item);
			break;
		case 2:
			updateAuthorFirstName(item);
			break;
		case 3:
			updateAuthorLastName(item);
			break;
		case 4:
			updateAuthorDOB(item);
			break;
		case 5:
			updatePrice(item);
			break;
		case 6:
			updatePages(item);
			break;
		case 7:
			updateDueDays(item);
			break;
		case 8:
			updatePublishingDate(item);
			break;
		default:
			System.out.println("Invalid choice.");
		}
	}
	public static void showMenu() {
		System.out.println("Enter the number of the attribute you want to update:");
		System.out.println("1. Title");
		System.out.println("2. Author's First Name");
		System.out.println("3. Author's Last Name");
		System.out.println("4. Author's Date of Birth (YYYY-MM-DD)");
		System.out.println("5. Price");
		System.out.println("6. Pages");
		System.out.println("7. Due Days");
		System.out.println("8. Publishing Date (YYYY-MM-DD)");
	}
	public static void updateBook(String title) {
		Item found = findItemByTitle(title);

		// instanceof guard: a title belonging to another item type used to
		// raise a ClassCastException here.
		if (!(found instanceof Book)) {
			System.out.println("Book not found.");
			return;
		}
		Book bookToUpdate = (Book) found;

		System.out.println("Current information for the book:");
		System.out.println(bookToUpdate);

		Scanner scanner = SCANNER;
		showMenu();

		System.out.println("9. ISBN");
		System.out.println("10. Genre");
		System.out.println("11. Description");
		System.out.print("Enter your choice: ");

		int choice = scanner.nextInt();
		scanner.nextLine(); // Consume the newline character

		if (choice>=1 && choice<=8) {
			updateItem(bookToUpdate, choice);
		} else if (choice == 9) {
			System.out.print("Enter the new ISBN: ");
			bookToUpdate.setISBN(scanner.nextLine());
			System.out.println("Book updated successfully!");
		} else if (choice == 10) {
			System.out.print("Enter the new genre: ");
			bookToUpdate.setGenre(scanner.nextLine());
			System.out.println("Book updated successfully!");
		} else if (choice == 11) {
			System.out.print("Enter the new description: ");
			bookToUpdate.setDescription(scanner.nextLine());
			System.out.println("Book updated successfully!");
		} else {
			System.out.println("Invalid choice.");
		}
		saveItemsToFile();
	}
	public static void updateScientificJournal(String title) {
		Item found = findItemByTitle(title);

		if (!(found instanceof ScientificJournal)) {
			System.out.println("Scientific journal not found.");
			return;
		}
		ScientificJournal journalToUpdate = (ScientificJournal) found;

		System.out.println("Current information for the scientific journal:");
		System.out.println(journalToUpdate);

		Scanner scanner = SCANNER;
		showMenu();
		// Numbered 9/10 to follow on from the shared 1-8 menu above; the
		// printed numbers used to disagree with the cases handled below.
		System.out.println("9. Publication Frequency");
		System.out.println("10. Impact Factor");
		System.out.print("Enter your choice: ");

		int choice = scanner.nextInt();
		scanner.nextLine(); // Consume the newline character

		if (choice>=1 && choice<=8) {
			updateItem(journalToUpdate, choice);
		} else if (choice == 9) {
			System.out.print("Enter the new publication frequency: ");
			journalToUpdate.setPublicationFrequency(scanner.nextLine());
			System.out.println("Scientific journal updated successfully!");
		} else if (choice == 10) {
			System.out.print("Enter the new impact factor: ");
			journalToUpdate.setImpactFactor(Double.parseDouble(scanner.nextLine()));
			System.out.println("Scientific journal updated successfully!");
		} else {
			System.out.println("Invalid choice.");
		}
		saveItemsToFile();
	}
	public static void updateMagazine(String title) {
		Item found = findItemByTitle(title);

		if (!(found instanceof Magazine)) {
			System.out.println("Magazine not found.");
			return;
		}
		Magazine magazineToUpdate = (Magazine) found;

		System.out.println("Current information for the magazine:");
		System.out.println(magazineToUpdate);

		Scanner scanner = SCANNER;
		showMenu();
		System.out.println("9. Issue Number");
		System.out.print("Enter your choice: ");

		int choice = scanner.nextInt();
		scanner.nextLine();

		if (choice>=1 && choice<=8) {
			updateItem(magazineToUpdate, choice);
		} else if (choice == 9) {
			System.out.print("Enter the new issue number: ");
			magazineToUpdate.setIssueNumber(Integer.parseInt(scanner.nextLine()));
			System.out.println("Magazine updated successfully!");
		} else {
			System.out.println("Invalid choice.");
		}
		saveItemsToFile();
	}
	public static void updateNewspaper(String title) {
		Item found = findItemByTitle(title);

		if (!(found instanceof NewsPaper)) {
			System.out.println("Newspaper not found.");
			return;
		}
		NewsPaper newspaperToUpdate = (NewsPaper) found;

		System.out.println("Current information for the newspaper:");
		System.out.println(newspaperToUpdate);

		Scanner scanner = SCANNER;
		showMenu();
		System.out.println("9. Issue Language");
		System.out.print("Enter your choice: ");

		int choice = scanner.nextInt();
		scanner.nextLine(); // Consume the newline character

		// "else if", not "if": the missing else meant choices 1-8 fell through
		// and printed "newspaper not found" after updating successfully.
		if (choice>=1 && choice<=8) {
			updateItem(newspaperToUpdate, choice);
		} else if (choice == 9) {
			System.out.print("Enter the new issue language: ");
			newspaperToUpdate.setIssueLanguage(scanner.nextLine());
			System.out.println("Newspaper updated successfully!");
		} else {
			System.out.println("Invalid choice.");
		}
		saveItemsToFile();
	}
	public static void displayAllItems() {
		if (items.isEmpty()) {
			System.out.println("No items in the library.");
		} else {
			System.out.println("All items in the library:");
			for (Item item : items) {
				System.out.println(item);
				System.out.println("---------------"); // Separator between items
			}
		}
	}

	public static void  readCustomersfromfile() {
		try (ObjectInputStream ois = new ObjectInputStream(new FileInputStream("Customers.txt"))) {
			customers = (ArrayList<Customer>) ois.readObject();
			ois.close();
		} catch (FileNotFoundException e) {
			System.out.println("No existing customer data found");
		} catch (IOException | ClassNotFoundException e) {
			e.printStackTrace();
		}
	}
	public static void saveCustomersToFile() {
		FileOutputStream file;
		ObjectOutputStream oos;
		try {
			file =new FileOutputStream("Customers.txt");
			oos=new ObjectOutputStream(file);
			oos.writeObject(customers);
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
	public static void addcustomer() {
		readCustomersfromfile();
		String cuId =generateUniqueCustomerID();
		System.out.println("Your customer ID :"+cuId);
		Scanner in = SCANNER;
		System.out.println("Enter customer information:");			
		System.out.print("customer first name:");
		String firstName = in.nextLine();
		System.out.print("customer last name:");
		String lastName = in.nextLine();
		System.out.println("Date of birth (Format: YYYY-MM-DD)");
		String datebirth=in.nextLine();
		LocalDate birth=LocalDate.parse(datebirth);
		System.out.print("address");
		String address = in.nextLine();
		System.out.print("phoneNumber");
		String phone = in.nextLine();
		System.out.print("Are you a student?");
		String student=in.nextLine();
		boolean isStudent=false;
		if (student.equalsIgnoreCase("yes")) {
			isStudent=true;
		}
		Customer customer=new Customer(cuId,firstName,lastName,birth,address,phone,isStudent);
		customers.add(customer);
		saveCustomersToFile();
	}
	public static Customer findCustomerbyId(String customerID) {
		readCustomersfromfile();
		for (Customer customer : customers) {
			if (customer.getCustomerID().equalsIgnoreCase(customerID)) {
				return customer;
			}
		}
		return null; // Customer not found
	}
	public static String generateUniqueCustomerID() {
		int cusnum = 110;

		while (true) {
			String stringcus = String.valueOf(cusnum);
			Customer check = findCustomerbyId(stringcus);

			if (check == null) {
				return stringcus;  // unique customer id
			}

			cusnum++;
		}
	}
	public static void updateExistingCustomer(String searchCustomerID) {
		readCustomersfromfile();
		boolean found = false;

		for (Customer customer : customers) {
			if (customer.getCustomerID().equalsIgnoreCase(searchCustomerID)) {
				found = true;
				System.out.println("Customer found - Enter new information:");

				updateCustomer(customer);

				saveCustomersToFile();
				break;
			}
		}

		if (!found) {
			System.out.println("Customer not found with the given ID.");
		}
	}
	public static void updateCustomer(Customer customer) {
		Scanner scanner = SCANNER;
		System.out.println("What do you want to update?"+"\n"+"1-firstname"+"\n"+
				"2-Lastname"+"\n"+"3-dateOfBirth"+"\n"+"4-address"+"\n"+"5-phonenumber"+"\n"+"6-Student status");
		String updt=scanner.nextLine();
		if(updt.equals("1")) {	        
			System.out.print("Enter new First Name: ");
			String newFirstName = scanner.nextLine();
			customer.setFirstName(newFirstName);}
		if(updt.equals("2")) {
			System.out.print("Enter new Last Name: ");
			String newLastName = scanner.nextLine();
			customer.setLastName(newLastName);}
		if(updt.equals("3")) {
			System.out.println("Enter new dateOfBirth");
			String newdatebirth = scanner.nextLine();
			LocalDate birth=LocalDate.parse(newdatebirth);
			customer.setDateOfBirth(birth);
		}
		if(updt.equals("4")) {
			System.out.println("Enter new address");
			String newaddress = scanner.nextLine();
			customer.setAddress(newaddress);

		}
		if(updt.equals("5")) {
			System.out.println("Enter new phonenumber");
			String newphone = scanner.nextLine();
			customer.setPhoneNumber(newphone);
		}
		if(updt.equals("6")) {
			System.out.println("Enter new student status(yes for student )(No for not a student)");
			String newstatus = scanner.nextLine();
			boolean isStudent=false;
			if (newstatus.equalsIgnoreCase("yes")) {
				isStudent=true;
			}
			customer.setStudent(isStudent);
		}

		System.out.println("Customer information updated successfully.");
	}
	public static void deleteExistingcustomer(String searchbyCustomerID) {
		readCustomersfromfile();
		int size = customers.size();
		boolean found = false;

		for (int i = 0; i < size; i++) {
			Customer customer = customers.get(i);
			if (customer.getCustomerID().equalsIgnoreCase(searchbyCustomerID)) {
				found = true;
				customers.remove(i);

				saveCustomersToFile();

				System.out.println("Customer deleted Successfully.");
				break;
			}
		}

		if (!found) {
			System.out.println("Customer not found for the given ID.");
		}
	}



	public static void borrowTransaction(String customerID, int itemID) {
	    readTransactionsFromFile();
	    Customer customer = findCustomerbyId(customerID);
	    Item item = findItemById(itemID);

	    if (customer == null) {
	        System.out.println("Customer not found for the given ID.");
	        return;
	    }

	    if (item == null) {
	        System.out.println("Item not found for the given ID.");
	        return;
	    }

	    // Check if the item is already borrowed
	    if (isItemBorrowed(itemID)) {
	        System.out.println("Sorry, the item is already borrowed.");
	        return;
	    }
	    String tid = generateUniqueTransactionID();
	    // Perform the borrow transaction
	    Transaction transaction = new Transaction(
	    		tid, customer, item, LocalDate.now(), null, setservice()
	    );

	    transactions.add(transaction);
	    saveTransactionsToFile();

	    System.out.println("Transaction set successfully.");
	    System.out.println(tid);
	}

	private static boolean isItemBorrowed(int itemId) {
	    // Check if the item is already borrowed
	    for (Transaction transaction : transactions) {
	        if (transaction.getItem().getID() == (itemId) && transaction.getCheckInDate() == null) {
	            return true;
	        }
	    }
	    return false;
	}


	public static void returnTransaction(String transactionID) {
		readTransactionsFromFile();

		// A transaction ID identifies exactly one transaction, so find it and
		// return it. The old version wrapped it in a one-element list, tested
		// for size()==0 (never true) and then asked which one to return.
		for (Transaction transaction : transactions) {
			if (transaction == null) {
				continue;
			}
			if (transaction.getTransactionID().equalsIgnoreCase(transactionID)) {
				if (transaction.getCheckInDate() != null) {
					System.out.println("This item has already been returned.");
					return;
				}
				transaction.setCheckInDate(LocalDate.now());
				saveTransactionsToFile();
				System.out.println("Item returned successfully!");
				System.out.println(transaction);
				return;
			}
		}

		System.out.println("No transaction found with ID: " + transactionID);
	}


	private static Service setservice(){
		System.out.println("do you want another services yes or no ");

		Scanner scanner = SCANNER;
		String in= scanner.nextLine();
		if(in.equalsIgnoreCase("no")) {
			return null;
		}else {
			System.out.println("what services do you want? printing or proofreading ");
			String sName= scanner.nextLine();
			Service s= new Service();
			if (sName.equalsIgnoreCase("printing")) {
				s.setPrinting(true); 
				System.out.println("Enter the printing cost per page:");
				double printingCostPerPage = scanner.nextDouble();
				s.setPrintingCostPerPage(printingCostPerPage); ;
			} else if (sName.equalsIgnoreCase("proofReading")) {
				s.setProofReading(true);
				System.out.println("Enter the proofreading cost per page:");
				double proofReadingCostPerPage = scanner.nextDouble();
				s.setProofReadingCostPerPage(proofReadingCostPerPage);
			}return s;
		}

	}



	private static Item findItemById(int itemID) {
		for (Item item : items) {
			if (item.getID()==itemID) {
				return item;
			}

		}return null;// Item not found

	}




	public static String generateUniqueTransactionID() {
		int tranID = 1000;

		while (true) {
			String stringtran = String.valueOf(tranID);
			Transaction check = isTransactionIDUnique(stringtran);

			if (check == null) {
				return stringtran;  // unique Transaction id
			}

			tranID++;   
		}

	}
	public static Transaction isTransactionIDUnique(String TransactionID) {
		readTransactionsFromFile();
		for (Transaction transaction : transactions) {
			if (transaction.getTransactionID().equalsIgnoreCase(TransactionID)) {
				return transaction;
			}
		}
		return null; // TransactionID not found
	}
	public static void readTransactionsFromFile() {
	    try (ObjectInputStream ois = new ObjectInputStream(new FileInputStream("transactions.txt"))) {
	        Object obj = ois.readObject();
	        if (obj instanceof ArrayList) {
	            transactions = (ArrayList<Transaction>) obj;
	        } else {
	            System.out.println("Invalid data in transactions file.");
	            // Handle the case where the file doesn't contain an ArrayList<Transaction>
	        }
	    } catch (FileNotFoundException e) {
	        System.out.println("No existing transaction data found");
	    } catch (IOException | ClassNotFoundException e) {
	        e.printStackTrace();
	    }
	}
	private static void saveTransactionsToFile() {
		FileOutputStream file;
		ObjectOutputStream oos;
		try {
			file =new FileOutputStream("transactions.txt");
			oos=new ObjectOutputStream(file);
			oos.writeObject(transactions);
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
	public void Itemsnotyetreturned() {
		System.out.println("items that not yet returned:");

		for (Transaction transaction : transactions) {
			if (transaction.getCheckInDate() == null) {
				Item item = transaction.getItem();
				System.out.println("Item ID:" + item.getID() +
						"--- Title: " + item.getTitle() +
						"--- Due date: " + transaction.getCheckOutDate());
			}
		}


	}
	public static void listAllAuthorPublications(String authorLastName) {
		loadItemsFromFile();
		for (Item item : items) {
			if (item instanceof Book) {
				Book book = (Book) item;
				Author author = book.getAuthor();

				if (author != null && author.getLastName().equalsIgnoreCase(authorLastName)) {
					System.out.println("Title: " + item.getTitle() +
							", Author: " + author.getFirstName() + " " + author.getLastName() +
							", ISBN: " + book.getISBN() +
							", Genre: " + book.getGenre() +
							", description: " + book.getDescription());
				}
			}if (item instanceof ScientificJournal) {
				ScientificJournal journal = (ScientificJournal) item;
				Author author = journal.getAuthor();

				if (author != null && author.getLastName().equalsIgnoreCase(authorLastName)) {
					System.out.println("Title: " + item.getTitle() +
							", Author: " + author.getFirstName() + " " + author.getLastName() +
							", Publication Frequency: " + journal.getPublicationFrequency() +
							", Impact Factor: " + journal.getImpactFactor());
				}
			}if (item instanceof Magazine) {
				Magazine magazine = (Magazine) item;
				Author author = magazine.getAuthor();

				// Filter by author last name here too - previously every
				// magazine was listed regardless of who was searched for.
				if (author != null && author.getLastName().equalsIgnoreCase(authorLastName)) {
					System.out.println("Title: " + item.getTitle() +
							", Author: " + author.getFirstName() + " " + author.getLastName() +
							", Issue Number: " + magazine.getIssueNumber());
				}
			}if (item instanceof NewsPaper) {
				NewsPaper newspaper = (NewsPaper) item;
				Author author = newspaper.getAuthor();

				if (author != null && author.getLastName().equalsIgnoreCase(authorLastName)) {
					System.out.println("Title: " + item.getTitle() +
							", Author: " + author.getFirstName() + " " + author.getLastName() +
							", Issue Language: " + newspaper.getIssueLanguage());
				}
			}
		}
	}

	public static void ListItemsnotyetreturned(String customerid) {
		readTransactionsFromFile();

		// Count first, then report once. The old version printed the "no items"
		// message for every transaction that did not match, so a customer with
		// one outstanding item saw the message repeated for all the others.
		boolean any = false;

		for (Transaction transaction : transactions) {
			if (transaction.getCustomer().getCustomerID().equalsIgnoreCase(customerid)
					&& transaction.getCheckInDate() == null) {
				if (!any) {
					System.out.println("Items that are not yet returned:");
					any = true;
				}
				Item item = transaction.getItem();
				System.out.println("Item ID:" + item.getID() +
						"--- Title: " + item.getTitle() +
						"--- Checked out: " + transaction.getCheckOutDate());
			}
		}

		if (!any) {
			System.out.println("There are no items outstanding for this customer.");
		}
	}

	public static void saveAndExit() {
		saveItemsToFile();
		saveCustomersToFile();
		saveTransactionsToFile();

		System.out.println("Exit");
		System.exit(0); // exit
	}


}