from PIL import Image

def remove_black_background(img_path):
    img = Image.open(img_path)
    img = img.convert("RGBA")
    datas = img.getdata()
    
    newData = []
    for item in datas:
        # If the pixel is very dark (black or near black), make it transparent
        if item[0] < 30 and item[1] < 30 and item[2] < 30:
            newData.append((255, 255, 255, 0))
        else:
            newData.append(item)
            
    img.putdata(newData)
    img.save(img_path, "PNG")

remove_black_background("public/gifts/rose.png")
print("Done")
