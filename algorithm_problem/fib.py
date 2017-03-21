
def finb1(n):
    block = [ 0 for i in range(n+1)]
    for i in range(0, n+1, 1):
      if i == 0 :
        block[i] = 0
      elif i == 1 :
        block[i] = 1
      else : 
        block[i] = block[i-1] + block[i-2]
    return block[n] 

def finb2(n):
   if n == 1:
      return 1
   elif n == 0:   
      return 0            
   else:                      
      return finb2(n-1) + finb2(n-2)  

print finb1(100)