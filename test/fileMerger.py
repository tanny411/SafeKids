import os

path="e:/safekids/test/links"
files=os.listdir(path)
#print(len(files))

ara=list()
def do(file):
    global ara
    file=path+"/"+file
    f=open(file,"r+")
    r=f.read()
    r=r.split('\n')
    #print(file," has ",len(r), "links.\n")
    ara+=r
    f.close()

for file in files:
    do(file)

for i in range(0,len(ara)):
    ara[i]=ara[i].strip().lower()

ara=list(set(ara))
ara.sort()
wr=open("alllink.txt","w+")
for i in ara:
    wr.write("%s\n" %i)

wr.close()