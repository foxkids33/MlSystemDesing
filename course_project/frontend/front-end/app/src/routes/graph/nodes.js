export const  jsonData = [
    {
        "id": "1",
        "name": "Variables and Data Types",
        "description": "Understanding variables and data types is fundamental in programming. This concept involves learning about integers, floats, strings, and how to store data in variables for effective manipulation within a program.",
        "difficulty": 1,
        "relationships": ["2", "3", "4"]
    },
    {
        "id": "2",
        "name": "Control Flow and Loops",
        "description": "Control flow directs the order of execution in a program, often through if-else statements and loop constructs like for and while loops, which allow for repetitive tasks.",
        "difficulty": 2,
        "relationships": ["1", "5", "6"]
    },
    {
        "id": "3",
        "name": "Functions and Procedures",
        "description": "Functions encapsulate blocks of code that perform specific tasks, improving code reuse and modularity. This topic covers defining, calling, and passing arguments to functions.",
        "difficulty": 2,
        "relationships": ["1", "7", "8"]
    },
    {
        "id": "4",
        "name": "Object-Oriented Programming (OOP)",
        "description": "OOP is a paradigm based on the concept of objects containing data and methods. Core principles include encapsulation, inheritance, and polymorphism, essential for complex software development.",
        "difficulty": 4,
        "relationships": ["1", "9", "10"]
    },
    {
        "id": "5",
        "name": "Data Structures",
        "description": "Data structures like arrays, lists, stacks, and queues provide ways to organize and store data efficiently. They are essential for optimizing memory usage and improving performance.",
        "difficulty": 3,
        "relationships": ["2", "6", "11"]
    },
    {
        "id": "6",
        "name": "Algorithms",
        "description": "Algorithms are step-by-step instructions for solving specific problems. Learning common algorithms, such as sorting and searching, is crucial for writing efficient code.",
        "difficulty": 4,
        "relationships": ["2", "5", "12"]
    },
    {
        "id": "7",
        "name": "Recursion",
        "description": "Recursion involves functions that call themselves to solve problems incrementally. It’s commonly used in problems that require repetitive breakdowns, like factorials and tree traversals.",
        "difficulty": 4,
        "relationships": ["3", "8", "13"]
    },
    {
        "id": "8",
        "name": "Memory Management",
        "description": "Memory management is crucial in programming, involving the allocation, deallocation, and optimization of memory. This is especially important in languages that do not have garbage collection.",
        "difficulty": 5,
        "relationships": ["3", "7", "14"]
    },
    {
        "id": "9",
        "name": "Debugging and Testing",
        "description": "Debugging is identifying and fixing errors, while testing ensures the code functions as expected. This involves understanding debugging tools and writing unit tests.",
        "difficulty": 3,
        "relationships": ["4", "10", "15"]
    },
    {
        "id": "10",
        "name": "Version Control",
        "description": "Version control systems like Git allow for tracking changes and collaborating with others. Understanding branching, merging, and commits is essential in team-based projects.",
        "difficulty": 2,
        "relationships": ["4", "9", "16"]
    },
    {
        "id": "11",
        "name": "Networking Basics",
        "description": "Networking involves understanding protocols, IP addresses, and client-server models, which are foundational for developing internet-based applications.",
        "difficulty": 3,
        "relationships": ["5", "12", "17"]
    },
    {
        "id": "12",
        "name": "APIs and RESTful Services",
        "description": "APIs (Application Programming Interfaces) allow different software applications to communicate. RESTful services follow specific conventions to ensure standardized data exchange.",
        "difficulty": 3,
        "relationships": ["6", "11", "18"]
    },
    {
        "id": "13",
        "name": "Web Development Basics",
        "description": "Web development involves building websites and web applications, typically using HTML, CSS, and JavaScript. Understanding the basics of frontend and backend development is essential.",
        "difficulty": 2,
        "relationships": ["7", "14", "19"]
    },
    {
        "id": "14",
        "name": "Frontend Frameworks",
        "description": "Frontend frameworks like React, Vue, and Angular help streamline the process of creating interactive web applications, offering modular and reusable components.",
        "difficulty": 4,
        "relationships": ["8", "13", "20"]
    },
    {
        "id": "15",
        "name": "Backend Development",
        "description": "Backend development focuses on server-side programming, handling databases, and ensuring data integrity and security. Popular languages include Python, Java, and Node.js.",
        "difficulty": 4,
        "relationships": ["9", "16", "17"]
    },
    {
        "id": "16",
        "name": "Database Management",
        "description": "Database management involves creating, reading, updating, and deleting data (CRUD operations) in databases like SQL and NoSQL, essential for data-driven applications.",
        "difficulty": 3,
        "relationships": ["10", "15", "18"]
    },
    {
        "id": "17",
        "name": "Cloud Computing",
        "description": "Cloud computing provides scalable computing resources over the internet. Knowledge of platforms like AWS, Azure, and Google Cloud is beneficial for modern development.",
        "difficulty": 5,
        "relationships": ["11", "15", "19"]
    },
    {
        "id": "18",
        "name": "DevOps Practices",
        "description": "DevOps combines development and operations, focusing on automation, CI/CD pipelines, and collaboration to improve deployment speed and efficiency.",
        "difficulty": 4,
        "relationships": ["12", "16", "20"]
    },
    {
        "id": "19",
        "name": "Machine Learning",
        "description": "Machine learning involves training algorithms to recognize patterns in data. Knowledge of models, data preprocessing, and libraries like TensorFlow is required.",
        "difficulty": 5,
        "relationships": ["13", "17", "20"]
    },
    {
        "id": "20",
        "name": "Artificial Intelligence",
        "description": "Artificial intelligence encompasses a range of techniques, from machine learning to natural language processing, to enable machines to perform tasks that require human intelligence.",
        "difficulty": 5,
        "relationships": ["14", "18", "19"]
    }
]