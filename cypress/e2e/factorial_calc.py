results_array = []

input = list(range(10,100))

def factorialize(num):
  if (num < 0):
        return -1
  elif (num == 0): 
      return 1
  else:
      return (num * factorialize(num - 1))

for item in range(10,100):
    result = factorialize(item)
    results_array.append(result)

print(results_array)

f = open("results_array.txt", "w")
f.write(results_array)
f.close()