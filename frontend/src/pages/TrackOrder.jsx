import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { IoIosArrowRoundBack } from "react-icons/io";
import DeliveryTracking from "../components/deliveryTracking";
import { userServiceUrl } from "../App";

function TrackOrder() {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [currentOrder, setCurrentOrder] = useState(null);

  const handleGetOrder = async () => {
    try {
      const result = await axios.get(
        `${userServiceUrl}/api/v1/orders/get-order-by-id/${orderId}`,
        { withCredentials: true }
      );
      console.log("trackOrder", result.data);
      setCurrentOrder(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleGetOrder();
  }, [orderId]);

  return (
    <div className="max-w-4xl mx-auto p-4 flex flex-col gap-6">

      {/* Back Button */}
      <div
        className="flex items-center gap-3 mb-2 cursor-pointer"
        onClick={() => navigate("/")}
      >
        <IoIosArrowRoundBack size={35} className="text-[#ff4d2d]" />
        <h1 className="text-2xl font-bold">Track Order</h1>
      </div>

      {/* If data not loaded yet */}
      {!currentOrder ? (
        <p className="text-gray-600 text-center">Loading order...</p>
      ) : null}

      {/* Shop Orders */}
      {currentOrder?.shopOrders?.map((shopOrder, index) => {
        const deliveryBoy = shopOrder.assignedDeliveryBoy; // object or null

        return (
          <div
            className="bg-white p-5 rounded-2xl shadow-md border border-orange-300 space-y-4"
            key={index}
          >
            {/* Shop Details */}
            <div>
              <p className="text-lg font-bold text-[#ff4d2d]">
                {shopOrder?.shop?.name}
              </p>

              <p className="font-semibold">
                <span>Items: </span>
                {shopOrder.shopOrderItems?.map((i) => i.name).join(", ")}
              </p>

              <p>
                <span className="font-semibold">Subtotal:</span> ₹
                {shopOrder.subtotal}
              </p>

              <p className="mt-4">
                <span className="font-semibold">Delivery Address:</span>{" "}
                {currentOrder?.deliveryAddress?.text}
              </p>
            </div>

            {/* Status + Delivery Boy */}
            {shopOrder.status !== "delivered" ? (
              <>
                <h2 className="font-bold mt-2">Delivery Boy</h2>

                {deliveryBoy ? (
                  <div className="text-sm text-gray-700">
                    <p>
                      <span className="font-semibold">Name:</span>{" "}
                      {deliveryBoy.fullname}
                    </p>
                    <p>
                      <span className="font-semibold">Mobile:</span>{" "}
                      {deliveryBoy.mobile}
                    </p>
                  </div>
                ) : (
                  <p className="font-semibold text-gray-500">
                    Delivery Boy is not assigned yet
                  </p>
                )}
              </>
            ) : (
              <p className="text-green-600 font-semibold text-lg">Delivered</p>
            )}

            {/* LIVE MAP BOX */}
            {deliveryBoy && (
              <div className="h-[400px] w-full rounded-2xl overflow-hidden shadow-md">
                <DeliveryTracking
                  data={{
                    deliveryBoyLocation: {
                      lat: deliveryBoy.location?.coordinates?.[0],
                      lon: deliveryBoy.location?.coordinates?.[1],
                    },
                    customerLocation: {
                      lat: currentOrder.deliveryAddress?.latitude,
                      lon: currentOrder.deliveryAddress?.longitude,
                    },
                  }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default TrackOrder;
