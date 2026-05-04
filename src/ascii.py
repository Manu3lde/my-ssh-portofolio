from ascii_magic import AsciiArt
my_art = AsciiArt.from_image('C:/Users/aaman/OneDrive/Pictures/images.jpg')
#my_art.to_terminal(columns=30, monochrome=True)
# You can also save the ASCII art to a file
my_art.to_file('ascii_art.txt', columns=20, monochrome=True)
# pause = input("Press Enter to continue...")
print("ASCII art saved to ascii_art.txt")