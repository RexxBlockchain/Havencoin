
# Developer Setup

To run Havencoin locally or contribute to its development, follow these setup instructions:

### Prerequisites
- Python 3.8+
- pip
- Git

### Setting Up Your Local Environment

1. **Clone the repository:**
   ```bash
   git clone https://github.com/rexxweb3/Havencoin.git
   cd Havencoin
   ```

2. **Setup a virtual environment:**
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows, use `venv\Scriptsctivate`
   ```

3. **Install dependencies:**
   ```bash
   python3 -m pip install -r requirements.txt
   ```

4. **Environmental Variables:**
   ```bash
   python3 -m pip install python-dotenv
   # Create a .env file and populate it with necessary environment variables
   ```

5. **Running the Application:**
   ```bash
   python3 app.py
   ```

### Keep the App Active

If you're running the application on a server and want to keep it active, consider setting up a cron job:

1. **Open the crontab editor:**
   ```bash
   crontab -e
   ```

2. **Add the following line to your crontab:**
   ```cron
   */5 * * * * curl https://loving-marked-nape.glitch.me/
   ```

### Contributing

Follow these steps to make contributions:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/YourFeatureName`).
3. Commit your changes (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature/YourFeatureName`).
5. Open a pull request.
