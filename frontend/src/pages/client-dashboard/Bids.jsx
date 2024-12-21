import React, { useState, useEffect } from "react";
import { getClientBids, manageBid } from "../../services/bidService";
import { fetchProfile } from "../../services/authService";
import Alert from "../../components/Alert";
import Loading from "../../components/Loading";

function Bids() {
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ isOpen: false, type: "", message: "" });
  const [freelancers, setFreelancers] = useState({});

  useEffect(() => {
    const fetchBids = async () => {
      try {
        const response = await getClientBids();
        if (response.success && response.data?.bids) {
          setBids(response.data.bids);
          fetchFreelancers(response.data.bids); // Fetch freelancers in the background
        } else {
          setAlert({ isOpen: true, type: "error", message: "Failed to load bids." });
        }
      } catch (error) {
        setAlert({ isOpen: true, type: "error", message: error.message });
      } finally {
        setLoading(false);
      }
    };

    const fetchFreelancers = async (bids) => {
      const freelancerIds = [...new Set(bids.map((bid) => bid.freelancerId))];
      try {
        const profiles = await Promise.all(
          freelancerIds.map((id) => fetchProfile(id).catch(() => null))
        );
        const freelancerData = profiles.reduce((acc, profile, index) => {
          if (profile) {
            acc[freelancerIds[index]] = profile.name;
          }
          return acc;
        }, {});
        setFreelancers(freelancerData);
      } catch (error) {
        console.error("Error fetching freelancers:", error);
      }
    };

    fetchBids();
  }, []);

  const handleBidAction = async (bidId, action) => {
    try {
      const response = await manageBid(bidId, action);
      if (response.success) {
        setBids((prevBids) =>
          prevBids.map((bid) =>
            bid._id === bidId ? { ...bid, status: action === "accept" ? "accepted" : "rejected" } : bid
          )
        );
        setAlert({ isOpen: true, type: "success", message: `Bid ${action}ed successfully.` });
        setTimeout(() => setAlert({ isOpen: false, type: "", message: "" }), 1000); // Dismiss after 1 second
      } else {
        setAlert({ isOpen: true, type: "error", message: "Failed to update bid." });
      }
    } catch (error) {
      setAlert({ isOpen: true, type: "error", message: error.message });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "accepted":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {loading && <Loading />}
      {!loading && (
        <>
          <Alert
            type={alert.type}
            message={alert.message}
            isOpen={alert.isOpen}
            onClose={() => setAlert({ ...alert, isOpen: false })}
          />
          <h1 className="text-3xl font-semibold text-gray-900 mb-6">Bids</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bids.map((bid) => (
              <div
                key={bid._id}
                className="bg-white rounded-lg shadow-lg p-6 transform transition hover:scale-105 hover:shadow-xl"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">{bid.projectTitle}</h2>
                    <p className="text-gray-600 mt-1">
                      by {freelancers[bid.freelancerId] || "Loading..."}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm capitalize ${getStatusColor(
                      bid.status
                    )}`}
                  >
                    {bid.status}
                  </span>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-gray-600">Bid Amount</p>
                  <p className="font-semibold text-lg">₹{bid.bidAmount}</p>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-gray-600">Proposal</p>
                  <p className="mt-1 text-gray-700">{bid.proposal}</p>
                </div>
                {bid.status === "pending" && (
                  <div className="mt-4 flex space-x-4">
                    <button
                      className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                      onClick={() => handleBidAction(bid._id, "accept")}
                    >
                      Accept Bid
                    </button>
                    <button
                      className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                      onClick={() => handleBidAction(bid._id, "reject")}
                    >
                      Reject Bid
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default Bids;