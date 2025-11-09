--- Create SystemAdmin Table
CREATE TABLE SystemAdmin (
    AdminID TEXT PRIMARY KEY,
    Name TEXT NOT NULL,
    Email TEXT NOT NULL UNIQUE,
    Phone TEXT,
    PasswordHash TEXT NOT NULL
);
--- Create Customer Table
CREATE TABLE Customer (
    CustomerID TEXT PRIMARY KEY,
    Name TEXT NOT NULL,
    Email TEXT NOT NULL UNIQUE,
    Phone TEXT,
    PasswordHash TEXT NOT NULL
);
--- Create Worker Table
CREATE TABLE Worker (
    WorkerID TEXT PRIMARY KEY,
    AvailabilityStatus TEXT NOT NULL,
    Name TEXT NOT NULL,
    Email TEXT NOT NULL UNIQUE,
    Phone TEXT,
    PasswordHash TEXT NOT NULL
);
--- Create RestaurantStaff Table
CREATE TABLE RestaurantStaff (
    StaffID TEXT PRIMARY KEY,
    Name TEXT NOT NULL,
    Email TEXT NOT NULL UNIQUE,
    Phone TEXT,
    PasswordHash TEXT NOT NULL,
    RestaurantID TEXT,
    FOREIGN KEY (RestaurantID) REFERENCES Restaurant(RestaurantID)
);
--- Create Restaurant Table
CREATE TABLE Restaurant (
    RestaurantID TEXT PRIMARY KEY,
    Name TEXT NOT NULL,
    Location TEXT NOT NULL,
    OperatingHours TEXT NOT NULL
);
--- Create Menu Table
CREATE TABLE Menu (
    MenuID TEXT PRIMARY KEY,
    RestaurantID TEXT,
    Name TEXT NOT NULL,
    Description TEXT,
    FOREIGN KEY (RestaurantID) REFERENCES Restaurant(RestaurantID)
);
--- Create MenuItem Table
CREATE TABLE MenuItem (
    ItemID TEXT PRIMARY KEY,
    MenuID TEXT,
    Name TEXT NOT NULL,
    Description TEXT,
    Price REAL NOT NULL CHECK(Price > 0),
    Quantity INTEGER DEFAULT 0 CHECK(Quantity >= 0),
    FOREIGN KEY (MenuID) REFERENCES Menu(MenuID)
);
--- Create Order Table
CREATE TABLE "Order" (
    OrderID TEXT PRIMARY KEY,
    CustomerID TEXT,
    RestaurantID TEXT,
    DeliveryLocation TEXT,
    OrderStatus TEXT NOT NULL,
    TotalCost REAL,
    Tip REAL DEFAULT 0,
    FOREIGN KEY (CustomerID) REFERENCES Customer(CustomerID),
    FOREIGN KEY (RestaurantID) REFERENCES Restaurant(RestaurantID)
);
--- Create OrderItem Table
CREATE TABLE OrderItem (
    OrderID TEXT,
    ItemID TEXT,
    Quantity INTEGER NOT NULL CHECK(Quantity > 0),
    Price REAL NOT NULL CHECK(Price > 0),
    PRIMARY KEY (OrderID, ItemID),
    FOREIGN KEY (OrderID) REFERENCES "Order"(OrderID),
    FOREIGN KEY (ItemID) REFERENCES MenuItem(ItemID)
);
--- Create DeliveryJob Table
CREATE TABLE DeliveryJob (
    JobID TEXT PRIMARY KEY,
    OrderID TEXT,
    WorkerID TEXT,
    AcceptTime DATETIME,
    CompletionTime DATETIME,
    JobStatus TEXT NOT NULL,
    FOREIGN KEY (OrderID) REFERENCES "Order"(OrderID),
    FOREIGN KEY (WorkerID) REFERENCES Worker(WorkerID)
);