import { ethers } from "./ethers-5.6.esm.min.js";

const provider = new ethers.providers.Web3Provider(window.ethereum);
let signer;

const contractAddress = "0x16B75012e5E4957c2236807149a0B5DC02240E29";
const contractAbi = [
  {
    name: "propose",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      {
        name: "targets",
        type: "address[]",
      },
      {
        name: "values",
        type: "uint256[]",
      },
      {
        name: "signatures",
        type: "string[]",
      },
      {
        name: "calldatas",
        type: "bytes[]",
      },
      {
        name: "description",
        type: "string",
      },
    ],
    outputs: [],
    visibility: "external",
  },
];

const contract = new ethers.Contract(contractAddress, contractAbi, provider);

const connectButton = document.getElementById("connect-button");
const proposalForm = document.getElementById("proposal-form");
const submitButton = document.getElementById("submit-button");

connectButton.onclick = connectWallet();
submitButton.innerHTML = "";

async function connectWallet() {
  try {
    await window.ethereum.request({ method: "eth_requestAccounts" });
    signer = provider.getSigner();
    connectButton.innerHTML = "Connected";
    submitButton.innerHTML = "";
  } catch (error) {
    console.error(error);
  }
}

proposalForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const targets = event.target.targets.value.split(",");
  const values = event.target.values.value
    .split(",")
    .map((value) => Number(value));
  const signatures = event.target.signatures.value.split(",");
  const calldatas = event.target.calldatas.value.split(",");
  const description = event.target.description.value;

  const tx = await contract
    .propose(targets, values, signatures, calldatas, description)
    .connect(signer);

  console.log(`Proposal created with transaction hash: ${tx.hash}`);
});
