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
  const optionsList = document.getElementById("options-list");
  const commandOutput = document.getElementById("command-output");
  const copyCommandButton = document.getElementById("copy-command-button");

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
          wheelSelections[selectedWheelSlotIndex] = { id: parseInt(id), text: text };
          updateCommandOutput();
          // Optionally, deselect the option in the list or the wheel slot
          document.querySelectorAll("#options-list li.selected-option").forEach((opt) => opt.classList.remove("selected-option"));
          selectedSlot.classList.add("selected"); // Keep wheel slot highlighted or change style
          // selectedWheelSlotIndex = null; // Uncomment to require re-selecting a wheel slot
        }
      });
      optionsList.appendChild(listItem);
    });

  // Create wheel slots
  const radius = 120; // Radius of the circle on which slots are placed
  const slotWidth = 100; // Width of a slot, used for offset calculation
  const slotHeight = 40; // Height of a slot, used for offset calculation

  for (let i = 0; i < numWheelSlots; i++) {
    const slot = document.createElement("div");
    slot.classList.add("wheel-slot");
    slot.dataset.index = i;
    slot.textContent = `Slot ${i + 1}`;

    let angle;
    if (i === 0) {
      // Top center
      angle = -Math.PI / 2;
    } else {
      // Distribute remaining 7 slots clockwise starting from the position after top-center
      // The circle for these 7 starts effectively after the first main slot.
      // Angle for the 'first' of these 7 items (index 1)
      angle = -Math.PI / 2 + ((2 * Math.PI) / (numWheelSlots - 1)) * (i - 1) * 0.857; // 0.857 is approx 6/7
      // A common approach for radial menus is to space them evenly.
      // If the first slot is at 12 o'clock, the others are placed around.
      // For 8 slots, angles are typically 0, 45, 90, 135, 180, 225, 270, 315 degrees.
      // Or in radians: 0, PI/4, PI/2, 3PI/4, PI, 5PI/4, 3PI/2, 7PI/4.
      // The image shows a central top slot, and then 7 around it.
      // Let's adjust the logic for the image layout.
      // Slot 0 (ping_wheel_phrase_0) is top-center.
      // Slots 1-7 (ping_wheel_phrase_1 to ping_wheel_phrase_7) are clockwise.

      if (i === 0) {
        // Top Center (Going In in example)
        angle = -Math.PI / 2;
      } else {
        // The other 7 slots are arranged in a circle. The image shows them not perfectly symmetrical.
        // It seems like a spider-web layout rather than a perfect circle for the outer elements.
        // Let's try to approximate the visual layout.
        // Approximate angles based on visual (0 is right, PI/2 is down)
        const visualAngles = [
          -Math.PI / 2, // Top Center (Slot 0)
          -Math.PI / 4, // Top Right-ish (Slot 1)
          0, // Right (Slot 2)
          Math.PI / 4, // Bottom Right-ish (Slot 3)
          Math.PI / 2, // Bottom Center (Slot 4)
          (3 * Math.PI) / 4, // Bottom Left-ish (Slot 5)
          Math.PI, // Left (Slot 6)
          (5 * Math.PI) / 4, // Top Left-ish (Slot 7)
        ];
        // The image has 8 slots in the wheel UI, but the command example has 9 (phrase_0 to phrase_8)
        // The prompt says: Phrase 1 (ping_wheel_phrase_0) starts from top center, and the rest is clockwise.
        // This implies 8 phrases for the wheel itself. The 9th phrase in the example might be an error or for a different context.
        // We will stick to 8 wheel slots as per the UI image.

        // Slot 0: Top Center
        // Slot 1: Top-Right
        // Slot 2: Right
        // Slot 3: Bottom-Right
        // Slot 4: Bottom
        // Slot 5: Bottom-Left
        // Slot 6: Left
        // Slot 7: Top-Left

        // Angle for slot 0 is -90 deg or -PI/2 rad.
        // For the other 7, they are roughly spread.
        // Let's use a slightly adjusted distribution for the 7 outer items.
        // The image shows: Stay Together (NW), Headed to Lane (W), Retreat (SW), Good Job (SE), What's the plan (E), Thanks (NE), Help (NNE)
        // And 'Going In' is the central selected one, which corresponds to the top slot in the list.

        // Mapping based on image (approximate)
        // Top Center: Slot 0 (ping_wheel_phrase_0)
        // Then clockwise:
        // 1. Help (index 1)
        // 2. Thanks (index 2)
        // 3. What's the plan? (index 3)
        // 4. Good Job (index 4)
        // 5. Retreat (index 5)
        // 6. Headed To Lane... (index 6)
        // 7. Stay Together (index 7)

        // Angles in radians (0 is East/Right, positive is CCW, negative is CW)
        // We want CW, so we'll use negative angles or adjust later.
        // Standard angle (0 = East, PI/2 = North, PI = West, 3PI/2 = South)
        // Our coordinate system for transform: translate(-50%, -50%) then rotate then translate to radius

        const angles = [
          -Math.PI / 2, // Slot 0 (Top Center)
          -Math.PI / 2 + (1 * Math.PI) / (numWheelSlots / 2.65), // Slot 1 (Help)
          -Math.PI / 2 + (2 * Math.PI) / (numWheelSlots / 1.8), // Slot 2 (Thanks)
          -Math.PI / 2 + (3 * Math.PI) / (numWheelSlots / 1.65), // Slot 3 (What's the plan?)
          Math.PI / 2, // Slot 4 (Good Job) - this is bottom, image is SE
          Math.PI / 2 + (1 * Math.PI) / (numWheelSlots / 2.65), // Slot 5 (Retreat) - this is SW
          Math.PI / 2 + (2 * Math.PI) / (numWheelSlots / 1.8), // Slot 6 (Headed to Lane)
          Math.PI / 2 + (3 * Math.PI) / (numWheelSlots / 1.65), // Slot 7 (Stay Together)
        ];

        // Corrected angles based on visual inspection of the image for 8 slots:
        // Slot 0: Top (Going In)
        // Slot 1: Top-Right (Help)
        // Slot 2: Right (Thanks)
        // Slot 3: Bottom-Right (What's the plan?)
        // Slot 4: Bottom (Good Job)
        // Slot 5: Bottom-Left (Retreat)
        // Slot 6: Left (Headed To Lane...)
        // Slot 7: Top-Left (Stay Together)

        const slotAngles = [
          -Math.PI / 2, // 0: Top
          -Math.PI / 4, // 1: Top-Right
          0, // 2: Right
          Math.PI / 4, // 3: Bottom-Right
          Math.PI / 2, // 4: Bottom
          (3 * Math.PI) / 4, // 5: Bottom-Left
          Math.PI, // 6: Left
          (-3 * Math.PI) / 4, // 7: Top-Left
        ];
        angle = slotAngles[i];
      }
    }

    const x = radius * Math.cos(angle) - slotWidth / 2;
    const y = radius * Math.sin(angle) - slotHeight / 2;

    // Center the wheel itself, then position slots relative to that center
    // The transform origin for slots should be their own center for rotation if needed, but here we just place them.
    // We position the top-left corner of the slot.
    slot.style.left = `calc(50% + ${x}px)`;
    slot.style.top = `calc(50% + ${y}px)`;

    slot.addEventListener("click", () => {
      // Deselect previously selected slot (if any)
      wheelSlots.forEach((s) => s.classList.remove("selected"));
      // Select current slot
      slot.classList.add("selected");
      selectedWheelSlotIndex = parseInt(slot.dataset.index);

      // Highlight the corresponding item in the options list if it's already set
      document.querySelectorAll("#options-list li.selected-option").forEach((opt) => opt.classList.remove("selected-option"));
      if (wheelSelections[selectedWheelSlotIndex]) {
        const currentOptionId = wheelSelections[selectedWheelSlotIndex].id;
        const optionInList = optionsList.querySelector(`li[data-id='${currentOptionId}']`);
        if (optionInList) {
          optionInList.classList.add("selected-option");
        }
      }
    });

    wheelContainer.appendChild(slot);
    wheelSlots.push(slot);
  }

  function updateCommandOutput() {
    let command = "";
    wheelSelections.forEach((selection, index) => {
      if (selection) {
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

  // Pre-fill from the example image if desired (first example command)
  // `ping_wheel_phrase_0 3;ping_wheel_phrase_1 2;ping_wheel_phrase_2 4;ping_wheel_phrase_3 55;ping_wheel_phrase_4 5;ping_wheel_phrase_5 5;ping_wheel_phrase_6 17;ping_wheel_phrase_7 18;ping_wheel_phrase_8 9;`
  // The image shows 8 slots, the command has 9. Let's use the first 8 from the command for the 8 slots.
  const exampleAssignments = [
    { slotIndex: 0, phraseId: 1 }, // Going In (UI shows this, command has 3 'Yes') - let's use UI: Going In (1)
    { slotIndex: 1, phraseId: 2 }, // Help
    { slotIndex: 2, phraseId: 4 }, // Thanks
    { slotIndex: 3, phraseId: 34 }, // What's the plan? (ID 34 'Need Plan', command has 55 'Its Dangerous') - UI: What's the plan (34)
    { slotIndex: 4, phraseId: 18 }, // Good Job (command has 5 'Retreat') - UI: Good Job (18)
    { slotIndex: 5, phraseId: 5 }, // Retreat
    { slotIndex: 6, phraseId: 42 }, // Headed To Lane... (ID 42, command has 17 'No') - UI: Headed to Lane (42)
    { slotIndex: 7, phraseId: 6 }, // Stay Together (command has 18 'Good Job') - UI: Stay Together (6)
  ];

  // Correcting example based on the image's wheel display
  const imageWheelState = {
    0: 1, // Top: Going In
    1: 2, // Help
    2: 4, // Thanks
    3: 34, // What's the plan? (Need Plan)
    4: 18, // Good Job
    5: 5, // Retreat
    6: 42, // Headed To Lane...
    7: 6, // Stay Together
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
