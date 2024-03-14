import tkinter as tk
import webbrowser

def display_popup(level, html_file):
    popup = tk.Toplevel(root)
    popup.title("Congratulations!")

    message = f"Level {level} completed successfully!"
    popup_message = tk.Label(popup, text=message)
    popup_message.pack()

    next_button = tk.Button(popup, text="Next Level", command=lambda: open_next_level(level, html_file, popup))
    next_button.pack()

def open_next_level(level, html_file, popup):
    popup.destroy()
    webbrowser.open(html_file)

# Your game logic for each level
def play_level(level, html_file):
    # Simulating completion of level
    print(f"Level {level} completed")
    if level < 3:  # Assuming 3 levels in total
        display_popup(level + 1, html_file[level])
    else:
        print("Game completed!")

# Example of playing each level
root = tk.Tk()
root.withdraw()

html_files = ["level1.html","level01.html", "level2.html", "level3.html","level4.html","level5.html","level6.html","level06.html","level7.html","level8.html"]

for level in range(10):  # Assuming 3 levels in total
    play_level(level + 1, html_files)

root.mainloop()  # Run the Tkinter event loop
