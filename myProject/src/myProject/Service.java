package myProject;



public class Service {
    private boolean printing;
    private double printingCostPerPage;
    private boolean proofReading;
    private double proofReadingCostPerPage;

    // Constructors
    public Service(boolean printing, double printingCostPerPage, boolean proofReading, double proofReadingCostPerPage) {
        this.printing = printing;
        this.printingCostPerPage = printingCostPerPage;
        this.proofReading = proofReading;
        this.proofReadingCostPerPage = proofReadingCostPerPage;
    }
    public Service() {
    	
    }
    // Getters and setters
    public boolean isPrinting() {
        return printing;
    }

    public void setPrinting(boolean printing) {
        this.printing = printing;
    }

    public double getPrintingCostPerPage() {
        return printingCostPerPage;
    }

    public void setPrintingCostPerPage(double printingCostPerPage) {
        this.printingCostPerPage = printingCostPerPage;
    }

    public boolean isProofReading() {
        return proofReading;
    }

    public void setProofReading(boolean proofReading) {
        this.proofReading = proofReading;
    }

    public double getProofReadingCostPerPage() {
        return proofReadingCostPerPage;
    }

    public void setProofReadingCostPerPage(double proofReadingCostPerPage) {
        this.proofReadingCostPerPage = proofReadingCostPerPage;
    }

    // toString() method
    @Override
    public String toString() {
        return "Service{" +
                "printing=" + printing +
                ", printingCostPerPage=" + printingCostPerPage +
                ", proofReading=" + proofReading +
                ", proofReadingCostPerPage=" + proofReadingCostPerPage +
                '}';
    }
}
