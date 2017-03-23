

def giveMoney(money, changes):
  result = [ 0 for i in range(len(changes))]

  for i in range(0, len(changes)-1, 1):

    if changes[i] > 0 and money > 0 :
      result[i] = money / changes[i]
      money = money % changes[i]
    
    if money == 0 :
      break

  return result

money = 99
changes = [100, 50, 20, 10, 5, 2, 1]

result = giveMoney(money, changes)

for i in range(0, len(result), 1):
    if result[i] > 0:
      print str(changes[i]) + " have: " + str(result[i]) + " ones"
