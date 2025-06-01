document.addEventListener("DOMContentLoaded", () => {
  const phrases = {
    1: "Going In",
    2: "Help",
    3: "Yes",
    4: "Thanks",
    5: "Retreat",
    6: "Stay Together",
    7: "Defend Lane",
    8: "Defend Yellow",
    9: "Defend Green",
    10: "Defend Blue",
    11: "Defend Purple",
    12: "Headed To Shop/Base",
    17: "No",
    18: "Good Job",
    19: "Good Game (Post Game) - All Chat",
    20: "Well Played (Post Game) - All Chat",
    21: "Thanks (Post Game) - All Chat",
    22: "Good Job (Post Game) - All Chat",
    23: "On My Way",
    24: "Push Lane",
    25: "Push Yellow",
    26: "Push Green",
    27: "Push Blue",
    28: "Push Purple",
    29: "Pinged Enemy Player",
    30: "Pinged Teammate",
    31: "Missing",
    32: "Need Heal",
    33: "Can Heal",
    34: "Need Plan",
    38: "Heading to Yellow Subnav",
    39: "Heading to Green Subnav",
    40: "Headed to Blue Subnav",
    41: "Headed to Purple Subnav",
    42: "Headed to Lane",
    43: "Help With Idol",
    44: "You're Welcome",
    45: "Sorry",
    46: "Going to Shop",
    47: "Request Follow",
    48: "Going to Gank",
    49: "Rejuv Drop",
    50: "Need Cover",
    51: "Nevermind",
    52: "No Teamfight",
    53: "Press The Advantage",
    54: "Lets Hide Here",
    55: "Its Dangerous",
    56: "I'll Clear Troopers",
    57: "Meet Here",
    58: "Flank",
    59: "Pregame Pings",
    60: "Leave Area",
  };

  const wheelContainer = document.querySelector(".wheel-container");
  const optionsList = document.querySelector(".options-list");
  const commandOutput = document.querySelector(".command-output");
  const copyCommandButton = document.querySelector(".copy-command-button");

  const wheelSlots = [];
  const numWheelSlots = 8;
  let selectedWheelSlotIndex = null;
  const wheelSelections = Array(numWheelSlots).fill(null); // To store {id, text} for each slot

  // Populate options list
  Object.entries(phrases)
    .sort(([idA], [idB]) => parseInt(idA) - parseInt(idB))
    .forEach(([id, text]) => {
      const listItem = document.createElement("li");
      listItem.textContent = text;
      listItem.dataset.id = id;
      listItem.addEventListener("click", () => {
        if (selectedWheelSlotIndex !== null) {
          const selectedSlot = wheelSlots[selectedWheelSlotIndex];
          selectedSlot.textContent = text;
          selectedSlot.dataset.id = id;
          // Store the selection
          wheelSelections[selectedWheelSlotIndex] = { id, text };
          // Update the options list to show this as selected for the current slot
          document.querySelectorAll(".options-list li.selected-option").forEach((opt) => opt.classList.remove("selected-option"));
          listItem.classList.add("selected-option");
          updateCommandOutput(); // Update command when an option is selected
        }
      });
      optionsList.appendChild(listItem);
    });

  // Get wheel slots (already in DOM)
  // Ensure they are in the correct order based on data-index
  const slotElements = Array.from(wheelContainer.querySelectorAll(".wheel-slot"));
  slotElements.sort((a, b) => parseInt(a.dataset.index) - parseInt(b.dataset.index));
  wheelSlots.push(...slotElements);

  // Add event listeners to the new static slots
  wheelSlots.forEach((slot, index) => {
    slot.addEventListener("click", () => {
      // Deselect previously selected slot (if any)
      wheelSlots.forEach((s) => s.classList.remove("selected"));
      // Select current slot
      slot.classList.add("selected");
      selectedWheelSlotIndex = parseInt(slot.dataset.index);

      // Highlight the corresponding item in the options list if it's already set
      document.querySelectorAll(".options-list li.selected-option").forEach((opt) => opt.classList.remove("selected-option"));
      const currentSelection = wheelSelections[selectedWheelSlotIndex];
      if (currentSelection) {
        const optionListItem = optionsList.querySelector(`li[data-id='${currentSelection.id}']`);
        if (optionListItem) {
          optionListItem.classList.add("selected-option");
        }
      }
    });
  });

  function updateCommandOutput() {
    let command = "";
    wheelSelections.forEach((selection, index) => {
      if (selection) {
        // The command format is `ping_wheel_phrase_INDEX ID;`
        // Assuming the data-index on the slot corresponds to the INDEX in the command.
        command += `ping_wheel_phrase_${index} ${selection.id};`;
      }
    });
    commandOutput.value = command.trim();
  }

  copyCommandButton.addEventListener("click", () => {
    if (commandOutput.value) {
      navigator.clipboard
        .writeText(commandOutput.value)
        .then(() => {
          // Optional: Show a temporary message like "Copied!"
          const originalText = copyCommandButton.textContent;
          copyCommandButton.textContent = "Copied!";
          setTimeout(() => {
            copyCommandButton.textContent = originalText;
          }, 1500);
        })
        .catch((err) => {
          console.error("Failed to copy command: ", err);
          // Optional: Show an error message to the user
        });
    }
  });

  // Pre-fill from the example image if desired
  const imageWheelState = {
    0: 1, // Top: Going In (ping_wheel_phrase_0)
    1: 6, // Left 1: Stay Together (ping_wheel_phrase_1)
    2: 18, // Left 2: Good Job (ping_wheel_phrase_2)
    3: 5, // Left 3: Retreat (ping_wheel_phrase_3)
    4: 2, // Right 1: Help (ping_wheel_phrase_4)
    5: 4, // Right 2: Thanks (ping_wheel_phrase_5)
    6: 34, // Right 3: What's the plan? (Need Plan) (ping_wheel_phrase_6)
    7: 42, // Bottom: Headed To Lane... (Contextual Slot) (ping_wheel_phrase_7)
  };

  Object.entries(imageWheelState).forEach(([slotIdx, phraseId]) => {
    const slotIndex = parseInt(slotIdx);
    if (phrases[phraseId]) {
      wheelSlots[slotIndex].textContent = phrases[phraseId];
      wheelSlots[slotIndex].dataset.id = phraseId;
      wheelSelections[slotIndex] = { id: phraseId, text: phrases[phraseId] };
    }
  });
  updateCommandOutput();
});
